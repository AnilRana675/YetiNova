// @ts-ignore - Deno imports work in Supabase Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// @ts-ignore - Deno globals available in Supabase Edge Functions
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_EMAIL = "yetinova.ai@gmail.com";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: {
    id: number;
    email: string;
    created_at: string;
  };
  schema: string;
  old_record: null | Record<string, unknown>;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const payload: WebhookPayload = await req.json();

    // Only process INSERT events
    if (payload.type !== "INSERT") {
      return new Response(
        JSON.stringify({ message: "Ignored: Not an INSERT event" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const subscriberEmail = payload.record.email;
    const signupTime = new Date(payload.record.created_at).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Kathmandu", // Nepal timezone
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
          🎉 New Waitlist Signup!
        </h1>
      </div>
      
      <!-- Content -->
      <div style="padding: 32px;">
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
          Great news! Someone just joined your YetiNova AI waitlist.
        </p>
        
        <!-- Subscriber Info Card -->
        <div style="background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%); border-left: 4px solid #0d9488; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 500;">Email</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 16px; font-weight: 600; text-align: right;">
                <a href="mailto:${subscriberEmail}" style="color: #0d9488; text-decoration: none;">${subscriberEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 500;">Signed Up</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right;">${signupTime}</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; margin: 0; text-align: center;">
          — YetiNova AI Notification System
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
      © 2026 YetiNova AI Tech Pvt. Ltd.
    </p>
  </div>
</body>
</html>
    `;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "YetiNova AI <noreply@yetinova.com>",
        to: [NOTIFY_EMAIL],
        subject: `🎉 New Waitlist Signup: ${subscriberEmail}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: data }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Notification email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent", id: data.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
