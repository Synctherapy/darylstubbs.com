import { NextResponse } from "next/server";

export const runtime = "edge";

interface BrandProduct {
  name: string;
  brand: string;
  url: string;
}

interface SelectedStrain {
  name: string;
  scientificName: string;
  friendlyRole: string;
  reason: string;
  mechanism: string;
  prebiotic: string;
  targetFoods: string[];
  topProducts: BrandProduct[];
  whyRecommended: string[];
}

interface TimelineItem {
  time: string;
  instructions: string;
  strains: string[];
}

interface BrandPromo {
  badge: string;
  badgeColor: string;
  badgeBg: string;
  cta: string;
}

function getProductPromo(brand: string): BrandPromo {
  if (brand === "Seed") {
    return {
      badge: "Up to 25% Off",
      badgeColor: "#059669", // emerald-600
      badgeBg: "#ecfdf5", // emerald-50
      cta: "Get 25% Off Seed"
    };
  }
  if (brand === "Just Thrive") {
    return {
      badge: "15% Off Coupon",
      badgeColor: "#d97706", // amber-600
      badgeBg: "#fffbeb", // amber-50
      cta: "Shop 15% Off"
    };
  }
  if (brand === "Pendulum") {
    return {
      badge: "Clinical Strength",
      badgeColor: "#2563eb", // blue-600
      badgeBg: "#eff6ff", // blue-50
      cta: "Order Pendulum"
    };
  }
  if (brand === "Ritual") {
    return {
      badge: "3-in-1 Synbiotic",
      badgeColor: "#7c3aed", // violet-600
      badgeBg: "#f5f3ff", // violet-50
      cta: "Order Ritual"
    };
  }
  return {
    badge: "Clinical Match",
    badgeColor: "#b05c3c", // brand accent
    badgeBg: "#fdf8f6", // brand accent light
    cta: `Buy ${brand}`
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[send-blueprint] RESEND_API_KEY environment variable is not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please contact the administrator." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, archetype, cfu, strains, timeline } = body ?? {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!archetype || !strains || strains.length === 0) {
      return NextResponse.json({ error: "Invalid blueprint data." }, { status: 400 });
    }

    // Build the email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Personalized Gut Blueprint</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f6f5; color: #1e1e1e; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
    <!-- Header -->
    <div style="background-color: #1a1e1b; padding: 32px 24px; text-align: center; border-bottom: 4px solid #c8a27d;">
      <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">Your Gut Blueprint</h1>
      <p style="color: #a3a8a4; font-size: 11px; font-weight: 600; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Personalized Probiotic Protocol</p>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">
      
      <!-- Greeting & Intro -->
      <div style="margin-bottom: 28px;">
        <p style="font-size: 14px; line-height: 1.6; color: #4a4a44; margin: 0;">
          Here is your customized clinical probiotic strain blueprint. We have analyzed your daily bowel habits, symptoms, diet, and lifestyle to identify the exact target bacterial strains and clinical protocols you need.
        </p>
      </div>

      <!-- Archetype Card -->
      <div style="background-color: #faf9f6; border: 1px solid #e8dbcf; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
        <span style="font-size: 9px; font-weight: 700; color: #b07e50; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 6px;">Gut Archetype Assessment</span>
        <h2 style="font-size: 18px; font-weight: 700; color: #1a1e1b; margin: 0 0 8px 0;">
          ${archetype.name.includes("Rebuilder") ? "💊" : archetype.name.includes("Slow") ? "🐢" : archetype.name.includes("Sensitive") ? "🛡️" : "🌱"} ${archetype.name}
        </h2>
        <p style="font-size: 12.5px; line-height: 1.6; color: #5c5c56; margin: 0;">${archetype.desc}</p>
      </div>

      <!-- Dosage -->
      <div style="border: 1px solid #e5e5e0; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
        <span style="font-size: 9px; font-weight: 700; color: #8a8a80; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 4px;">Target Daily Colony Dosage</span>
        <span style="font-size: 18px; font-weight: 700; color: #b05c3c;">${cfu}</span>
      </div>

      <!-- CRO Shopping Protocol List Summary -->
      <div style="background-color: #ffffff; border: 2px solid #1a1e1b; border-radius: 12px; padding: 20px; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        <h3 style="font-size: 13px; font-weight: 700; color: #1a1e1b; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e5e0; padding-bottom: 10px;">
          🛒 Your Personalized Protocol Shopping List
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${strains.map((s: SelectedStrain, index: number) => {
            const promo = getProductPromo(s.topProducts[0].brand);
            const badgeStyle = `font-size: 9px; font-weight: 700; color: ${promo.badgeColor}; background-color: ${promo.badgeBg}; padding: 2px 6px; border-radius: 4px; margin-left: 6px; text-transform: uppercase; display: inline-block;`;
            return `
              <tr style="border-bottom: 1px solid #f0efe9;">
                <td style="padding: 14px 0; font-size: 13px; font-weight: 600; color: #1a1e1b;">
                  ${index + 1}. ${s.topProducts[0].brand} ${s.topProducts[0].name}
                  <span style="${badgeStyle}">${promo.badge}</span>
                </td>
                <td style="padding: 14px 0; text-align: right;">
                  <a href="${s.topProducts[0].url}" style="font-size: 12px; font-weight: 700; color: #b05c3c; text-decoration: none; border-bottom: 2px solid #b05c3c; padding-bottom: 1px;" target="_blank">
                    Shop Now &rarr;
                  </a>
                </td>
              </tr>
            `;
          }).join("")}
        </table>
      </div>

      <!-- Recommended Strains -->
      <h3 style="font-size: 16px; font-weight: 700; color: #1a1e1b; margin: 0 0 20px 0; padding-bottom: 8px; border-bottom: 1px solid #e5e5e0; text-transform: uppercase; letter-spacing: 0.5px;">Recommended Target Strains</h3>
      
      ${strains.map((s: SelectedStrain) => {
        const promo = getProductPromo(s.topProducts[0].brand);
        return `
          <div style="margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px dashed #e5e5e0;">
            <div style="margin-bottom: 8px;">
              <h4 style="font-size: 15px; font-weight: 700; color: #1a1e1b; margin: 0 0 4px 0;">${s.name}</h4>
              <span style="font-size: 11px; font-weight: 700; color: #b05c3c; text-transform: uppercase; letter-spacing: 0.5px; display: block;">
                ★ ${s.friendlyRole}
              </span>
            </div>
            
            <p style="font-size: 12.5px; line-height: 1.6; color: #4a4a44; margin: 0 0 16px 0;">${s.reason}</p>
            
            <div style="margin-bottom: 16px; background-color: #faf9f6; border-radius: 8px; padding: 12px 16px; font-size: 12px;">
              <div style="margin-bottom: 8px;">
                <strong style="color: #1a1e1b; display: block; margin-bottom: 2px;">Why Recommended:</strong>
                <ul style="margin: 0; padding-left: 16px; color: #5c5c56; line-height: 1.5;">
                  ${s.whyRecommended.map((r: string) => `<li style="margin-bottom: 3px;">${r}</li>`).join("")}
                </ul>
              </div>
              
              <div style="margin-top: 8px; border-top: 1px solid #e5e5e0; pt: 8px; font-size: 12px; color: #5c5c56; padding-top: 8px;">
                <strong style="color: #1a1e1b;">Prebiotic Fuel Partner:</strong> ${s.prebiotic} (Foods: ${s.targetFoods.join(", ")})
              </div>
            </div>

            <!-- CRO Product Recommendation Card -->
            <table style="width: 100%; background-color: #faf9f6; border: 1px solid #e5e5e0; border-left: 4px solid #1a1e1b; border-radius: 8px; border-collapse: collapse;">
              <tr>
                <td style="padding: 16px; vertical-align: middle;">
                  <div style="margin-bottom: 4px;">
                    <span style="font-size: 8.5px; font-weight: 700; color: ${promo.badgeColor}; background-color: ${promo.badgeBg}; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-bottom: 6px;">${promo.badge}</span>
                    <span style="font-size: 8.5px; font-weight: 700; color: #8a8a80; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Recommended Clinical Brand</span>
                  </div>
                  <strong style="font-size: 14px; color: #1a1e1b; display: block; margin-bottom: 2px;">${s.topProducts[0].brand} ${s.topProducts[0].name}</strong>
                  <span style="font-size: 11px; color: #5c5c56; display: block;">Delivers clinical dose of <em>${s.scientificName}</em></span>
                </td>
                <td style="padding: 16px; vertical-align: middle; text-align: right; width: 140px;">
                  <a href="${s.topProducts[0].url}" style="background-color: #b05c3c; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 700; padding: 10px 16px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.06);" target="_blank">
                    ${promo.cta} &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </div>
        `;
      }).join("")}

      <!-- Timeline -->
      <h3 style="font-size: 16px; font-weight: 700; color: #1a1e1b; margin: 32px 0 20px 0; padding-bottom: 8px; border-bottom: 1px solid #e5e5e0; text-transform: uppercase; letter-spacing: 0.5px;">Daily Protocol Timeline</h3>
      
      <div style="margin-bottom: 32px;">
        ${timeline.map((t: TimelineItem) => `
          <div style="margin-bottom: 16px; padding-left: 12px; border-left: 2px solid #b05c3c;">
            <strong style="font-size: 13px; color: #1a1e1b; display: block; text-transform: uppercase; letter-spacing: 0.5px;">${t.time}</strong>
            <p style="font-size: 12px; color: #5c5c56; margin: 4px 0 8px 0; line-height: 1.5;">${t.instructions}</p>
            <div style="font-size: 11px; font-weight: 600; color: #8a8a80;">Target Strains: ${t.strains.join(", ")}</div>
          </div>
        `).join("")}
      </div>

      <!-- Call to Action -->
      <div style="text-align: center; margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e5e0;">
        <p style="font-size: 12.5px; color: #5c5c56; margin-bottom: 16px;">You can view and re-take the selector tool online at any time.</p>
        <a href="https://darylstubbs.com/tools/probiotic-strain-finder" style="display: inline-block; background-color: #b05c3c; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; padding: 12px 24px; border-radius: 30px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" target="_blank">
          Open Probiotic Finder
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #faf9f6; padding: 24px; text-align: center; border-top: 1px solid #e5e5e0; font-size: 10.5px; color: #8a8a80; line-height: 1.6;">
      &copy; 2026 Daryl Stubbs. All rights reserved.<br>
      <span style="display: block; margin-top: 8px; font-style: italic;">Disclaimer: These statements have not been evaluated by the Food and Drug Administration. This email is for educational and informational purposes only and is not a substitute for medical advice.</span>
    </div>
  </div>
</body>
</html>
    `;

    // Send the email using Resend REST API
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Daryl Stubbs <support@guthealthprogram.com>",
        to: email,
        subject: `Your Personalized Gut Blueprint - ${archetype.name}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("[send-blueprint] Resend API error response:", resendData);
      return NextResponse.json(
        { error: resendData?.message || "Failed to send email through Resend API" },
        { status: resendRes.status }
      );
    }

    console.log("[send-blueprint] Resend success response:", resendData);
    return NextResponse.json({ ok: true, id: resendData?.id });

  } catch (error: any) {
    console.error("[send-blueprint] Server error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
