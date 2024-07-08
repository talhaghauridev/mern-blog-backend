import { Request } from "express";
import geoip from "geoip-lite";
const getCurrentContextData = (req: any) => {
  const ip = req.clientIp || "unknown";
  const location: any = geoip.lookup(ip) || "unknown";
  const country = location.country ? location.country.toString() : "unknown";
  const city = location.city ? location.city.toString() : "unknown";
  const browser = req.useragent?.browser
    ? `${req.useragent.browser} ${req.useragent.version}`
    : "unknown";
  const platform = req.useragent?.platform
    ? req.useragent.platform.toString()
    : "unknown";
  const os = req.useragent?.os ? req.useragent.os.toString() : "unknown";
  const device = req.useragent?.device
    ? req.useragent.device.toString()
    : "unknown";

  const isMobile = req.useragent?.isMobile || false;
  const isDesktop = req.useragent?.isDesktop || false;
  const isTablet = req.useragent?.isTablet || false;

  const deviceType = isMobile
    ? "Mobile"
    : isDesktop
    ? "Desktop"
    : isTablet
    ? "Tablet"
    : "unknown";
  return { ip, country, city, browser, platform, os, device, deviceType };
};

export default getCurrentContextData;

export const saveLogInfo = async (
  req: Request,
  message?: string,
  type?: string,
  level?: string
) => {
  try {
    let context = null;
    if (req) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(req);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, Device Type: ${deviceType}, Browser: ${browser}, Platform: ${platform}, OS: ${os}, Device: ${device}`;
    }

    const log = {
      email: req ? req.body.email : null,
      context,
      message,
      type,
      level,
    };
    console.log(log);
  } catch (error) {
    console.log(error);
  }
};
