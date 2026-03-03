import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Keep-alive ping every 15s
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ keepAlive: true })}\n\n`));
      }, 15000);

      // Subscribe to INSERT events on users table
      const channel = supabase
        .channel('public:users')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'users' },
          (payload) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload.new)}\n\n`));
          }
        )
        .subscribe();

      req.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        supabase.removeChannel(channel);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}