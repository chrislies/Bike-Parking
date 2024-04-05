export const getImageSource = (rackType: string) => {
  if (!rackType) return "";

  const lowercaseType = rackType.toLowerCase();

  if (lowercaseType.includes("corral") || lowercaseType.includes("sled")) {
    return "/images/rack_bike-corral_gfi-sled.jpg";
  } else if (lowercaseType === "large hoop") {
    return "/images/rack_large-hoop.jpg";
  } else if (lowercaseType === "small hoop") {
    return "/images/rack_small-hoop.jpg";
  } else if (lowercaseType.includes("wave")) {
    return "/images/rack_wave-rack.jpg";
  } else if (lowercaseType === "u rack") {
    return "/images/rack_u-rack.jpg";
  } else if (lowercaseType.includes("opal")) {
    return "/images/rack_opal-rack.jpg";
  } else if (lowercaseType.includes("staple")) {
    return "/images/rack_staple.jpg";
  } else {
    return "";
  }
};
