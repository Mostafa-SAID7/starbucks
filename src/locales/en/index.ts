import general from "./common/general.json";
import auth from "./common/auth.json";
import chat from "./common/chat.json";
import notfound from "./common/notfound.json";
import navbar from "./navigation/navbar.json";
import footer from "./navigation/footer.json";
import legal from "./navigation/legal.json";
import errors from "./common/errors.json";
import loading from "./common/loading.json";
import accessibility from "./common/accessibility.json";
import cookieConsent from "./common/cookieConsent.json";

// Pages
import home from "./pages/home.json";
import menu from "./pages/menu.json";
import contact from "./pages/contact.json";
import privacyStatement from "./pages/privacy-statement.json";
import sustainability from "./pages/sustainability.json";
import termsOfUse from "./pages/terms-of-use.json";
import middleEast from "./pages/middle-east.json";
import communityImpact from "./pages/community-impact.json";
import cookies from "./pages/cookies.json";
import delivery from "./pages/delivery.json";
import ourCoffees from "./pages/our-coffees.json";
import newEra from "./pages/new-era.json";

const common = {
  ...general,
  auth,
  chat,
  notfound,
  errors,
  loading,
  accessibility,
  cookieConsent,
};

const navigation = {
  navbar,
  footer,
  legal,
};

const pages = {
  home,
  menu,
  contact,
  "privacy-statement": privacyStatement,
  sustainability,
  "terms-of-use": termsOfUse,
  "middle-east": middleEast,
  "community-impact": communityImpact,
  cookies,
  delivery,
  "our-coffees": ourCoffees,
  "new-era": newEra,
};

export default {
  common,
  navigation,
  pages,
};
