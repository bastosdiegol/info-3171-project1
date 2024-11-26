// CSS Colours to JS Constants
const ROOT_STYLES = getComputedStyle(document.documentElement);
const PRIMARY_COLOUR = ROOT_STYLES.getPropertyValue("--primary").trim();
const SECONDARY_COLOUR = ROOT_STYLES.getPropertyValue("--secondary").trim();
const INFO_COLOUR = ROOT_STYLES.getPropertyValue("--info").trim();
const DARK_COLOUR = ROOT_STYLES.getPropertyValue("--dark").trim();
const LIGHT_COLOUR = ROOT_STYLES.getPropertyValue("--light").trim();
