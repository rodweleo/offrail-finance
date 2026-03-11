function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) =>
      Array.isArray(value) ? value.length > 0 : !!value,
    ),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;
  return Response.json({
    accountAssociation: {
      // these will be added in step 5
      header: "",
      payload: "",
      signature: "",
    },
    miniapp: {
      version: "1",
      name: "Offrail Finance",
      iconUrl: "https://offrail-finance.vercel.app/icon.png",
      homeUrl: "https://offrail-finance.vercel.app",
      splashImageUrl: "https://offrail-finance.vercel.app/splash.png",
      splashBackgroundColor: "#202221",
      heroImageUrl: "https://offrail-finance.vercel.app/hero.png",
      tagline: "Borderless finance with Crypto",
      ogTitle: "Offrail Finance",
      ogDescription:
        "Offrail Finance enables individuals and businesses to instantly convert cryptocurrency into local currency and supports sending bulk payouts directly to bank accounts or mobile money.",
      ogImageUrl: "https://offrail-finance.vercel.app/hero.png",
      primaryCategory: "finance",
      tags: ["finance"],
    },
  });
}
