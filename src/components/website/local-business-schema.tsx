export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: "ToTo Barbershop",
    image: [
      "https://totobarbershop.com/images/about.png",
      "https://totobarbershop.com/images/interior.png",
      "https://totobarbershop.com/icon.svg",
    ],
    "@id": "https://totobarbershop.com",
    url: "https://totobarbershop.com",
    telephone: "0981378179",
    priceRange: "80.000 VND - 500.000 VND",
    currenciesAccepted: "VND",
    paymentAccepted: "Cash, Credit Card, VietQR, PayOS",
    address: {
      "@type": "PostalAddress",
      streetAddress: "85 Đồng Đen, Phường 12",
      addressLocality: "Quận Tân Bình",
      addressRegion: "Hồ Chí Minh",
      postalCode: "700000",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.793289,
      longitude: 106.644723,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "20:30",
      },
    ],
    sameAs: [
      "https://www.facebook.com/totobarbershopHCM",
      "https://www.instagram.com/totobarbershop_/",
      "https://www.tiktok.com/@totobarbershop85",
      "https://www.google.com/maps/place/Toto+babershop/@10.793289,106.644723,17z/data=!3m1!4b1!4m6!3m5!1s0x317529fab862286b:0x558f62689c90fdae!8m2!3d10.793289!4d106.644723",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.1",
      reviewCount: "73",
      bestRating: "5",
      worstRating: "1",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
