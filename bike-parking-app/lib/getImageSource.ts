export const getImageSource = (rackType: string) => {
  if (!rackType) return "";

  const lowercaseType = rackType.toLowerCase();

  if (lowercaseType.includes("corral") || lowercaseType.includes("sled")) {
    return "/images/rack_bike-corral_gfi-sled.png";
  } else if (lowercaseType === "large hoop") {
    return "/images/rack_large-hoop.png";
  } else if (lowercaseType === "small hoop") {
    return "/images/rack_small-hoop.png";
  } else if (lowercaseType.includes("wave")) {
    return "/images/rack_wave-rack.png";
  } else if (lowercaseType === "u rack") {
    return "/images/rack_u-rack.png";
  } else if (lowercaseType.includes("opal")) {
    return "/images/rack_opal-rack.png";
  } else if (lowercaseType.includes("staple")) {
    return "/images/rack_staple.png";
  } else {
    return "";
  }
};
