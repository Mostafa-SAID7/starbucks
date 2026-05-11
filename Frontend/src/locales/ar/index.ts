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
import cart from "./common/cart.json";

// We only include common/global translations in the main bundle.
// Page-specific translations are loaded dynamically by the pages themselves
// to optimize initial bundle size and first-load performance.

import pages from "./pages";

const common = {
  ...general,
  auth,
  chat,
  cart,
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

export default {
  common,
  navigation,
  pages,
};
