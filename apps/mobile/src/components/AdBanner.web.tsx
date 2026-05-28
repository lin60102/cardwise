import { AdPlaceholder } from "./AdPlaceholder";
import { isScreenshotMode } from "../services/screenshotMode";

export function AdBanner() {
  if (isScreenshotMode) {
    return null;
  }

  return <AdPlaceholder />;
}
