import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// const i18n = createI18n({
//   locale: localeZH.name,
//   fallbackLocale: localeEN.name,
//   messages,
// })

export default (app) => {
  app.use(ElementPlus, { size: "small", zIndex: 3000 });
  // app.use(i18n)
};
