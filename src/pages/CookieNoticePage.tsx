import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import InnerHeader from '../components/InnerHeader'
import Logo from '../components/Logo'

const CookieNoticePage: React.FC = () => {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO title={isRTL ? 'سياسة ملفات تعريف الارتباط | ستاربكس' : 'Cookie Notice | Starbucks'} />

      <InnerHeader
        title={isRTL ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Notice'}
        variant="light"
      />

      <div className="container mx-auto max-w-6xl px-6 py-14 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row-reverse">

          {/* ─── Sidebar ─── */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="bg-starbucks-green p-4 text-center">
                <Logo className="mx-auto h-16 w-16 object-contain mb-2" />
              </div>
              <div className="bg-gray-50 dark:bg-zinc-900 p-4 space-y-3">
                <a
                  href="https://www.starbucks.eg/ar/our-coffees"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full bg-starbucks-green py-3 text-center text-sm font-extrabold text-white hover:bg-starbucks-dark transition-all"
                >
                  {isRTL ? 'قائمتنا' : 'Our Menu'}
                </a>
                <a
                  href="https://www.starbucks.eg/ar/about-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full border-2 border-starbucks-dark py-3 text-center text-sm font-extrabold text-starbucks-dark dark:border-white dark:text-white hover:bg-starbucks-dark hover:text-white transition-all"
                >
                  {isRTL ? 'نبذة عنا' : 'About Us'}
                </a>
              </div>
            </div>
          </aside>

          {/* ─── Main Content ─── */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 text-right leading-relaxed text-gray-700 dark:text-gray-300 space-y-8"
            dir="rtl"
          >
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-starbucks-dark dark:text-white">سياسة ملفات تعريف الارتباط (الكوكيز) لدى ستاربكس</h1>
              <p className="text-sm text-gray-400">تسري هذه السياسة اعتباراً من تاريخ 15 مارس 2021</p>
              <p>
                تعمل ستاربكس كمعظم الشركات بالتعاون مع مزودي خدمات محددين لاستخدام ملفات تعريف الارتباط وملفات أخرى تستخدم تقنيات مشابهة (يشار إليها جميعاً بعبارة "ملفات الكوكيز") على مواقعنا وتطبيقاتنا للهواتف الذكية (يشار إليها جميعاً بعبارة "المواقع").
              </p>
              <p>
                تهدف سياسة ملفات الكوكيز لتوفير معلومات واضحة وشاملة لمستخدمي مواقعنا ("أنت") حول أنواع ملفات الكوكيز التي قد نستخدمها، وما هو الغرض من استخدامها، وكيف يمكنك إدارة واستخدام ملفات الكوكيز.
              </p>
              <p>
                لمزيد من المعلومات حول سياسة البيانات والخصوصية العامة لدينا، أو للتواصل معنا لأي استفسارات، يرجى الاطلاع على سياسة الخصوصية عبر موقع ستاربكس أو الاطلاع على بنود سياسة الخصوصية لدى ستاربكس هنا "بيان الخصوصية".
              </p>
            </div>

            <Section title="المحتويات">
              <p>يمكنك تخطي بعض الأقسام المحددة من سياسة ملفات الكوكيز الخاصة بنا عن طريق اختيار أياً من العناوين التالية:</p>
              <ul className="mt-3 space-y-2 pr-4 list-disc marker:text-starbucks-green">
                <li><a href="#section-1" className="text-starbucks-green hover:underline">ما هي ملفات الكوكيز؟</a></li>
                <li><a href="#section-2" className="text-starbucks-green hover:underline">هل عليك السماح بتفعيل ملفات الكوكيز؟</a></li>
                <li><a href="#section-3" className="text-starbucks-green hover:underline">هل هناك مصطلحات أساسية يجب معرفتها؟</a></li>
                <li><a href="#section-4" className="text-starbucks-green hover:underline">ما هي أنواع ملفات الكوكيز التي نستخدمها؟</a></li>
                <li><a href="#section-5" className="text-starbucks-green hover:underline">ما هي المعلومات الإضافية التي تحصل عليها باستخدام ملفات الكوكيز؟</a></li>
                <li><a href="#section-6" className="text-starbucks-green hover:underline">هل يمكنك تغيير إعدادات ملفات الكوكيز الخاصة بك؟</a></li>
                <li><a href="#section-7" className="text-starbucks-green hover:underline">هل هناك طرق أخرى لإلغاء الاشتراك بخدمة ملفات الكوكيز؟</a></li>
                <li><a href="#section-8" className="text-starbucks-green hover:underline">اين يمكن الحصول على المزيد من المعلومات؟</a></li>
              </ul>
            </Section>

            <div id="section-1">
              <Section title="1. ما هي ملفات الكوكيز؟">
                <p>
                  هي ملفات نصية صغيرة يقوم الموقع الإلكتروني بتخزينها على جهاز الكمبيوتر أو الهاتف الذكي الخاص بك عند زيارتك أي موقع، أو استخدامك أحد تطبيقات الهواتف الذكية أو عند الضغط على روابط تسويقية محددة يتم إرسالها عبر البريد الإلكتروني. عند زيارتك هذا الموقع أو استخدامك تطبيق الهاتف الذكي في المرات القادمة، سيتم التعرف على ملفات الكوكيز من قبل مالك الموقع أو الأطراف الأخرى التي تقوم بإعداد ملفات الكوكيز. تعد ملفات الكوكيز من الملفات المهمة عند استخدامها بطريقة صحيحة على مواقعنا حيث نستخدمها لنميزك عن المستخدمين الآخرين ولمعرفة المنتجات المفضلة لديك حتى نمنحك تجربة تسوق شخصية استثنائية، وكذلك لفهم أنماط استخدام الموقع، أو لأغراض تسويقية. تشمل ملفات الكوكيز الأخرى على إشارات الويب (Web beacons)، وبرامج Java Script، entity tags وملفات تخزين HTML5.
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <strong className="block text-starbucks-dark dark:text-white font-bold">ملفات الكوكيز</strong>
                    <p>هي ملفات صغيرة الحجم تحتوي على بيانات يتم إرسالها من سيرفر الموقع الإلكتروني يتم تخزينها على جهاز المستخدم من قبلك مؤقتاً أثناء التصفح أو لفترة زمنية محددة. تحتوي ملفات الكوكيز على بيانات يمكن لسيرفر الموقع الإلكتروني التعرف عليها وقراءتها.</p>
                  </div>
                  <div>
                    <strong className="block text-starbucks-dark dark:text-white font-bold">إشارات الويب "ويب بيكون"</strong>
                    <p>إشارات الويب هي صور صغيرة الحجم غير مرئية موجودة ضمن صفحات المواقع الإلكترونية والتطبيقات ورسائل البريد الإلكتروني وتسمى أحياناً "clear gifs" أو "single pixel gifs" أو "page tags" أو "web bugs". نحن نستخدم ملفات إشارات الويب لتتبع المواقع الإلكترونية التي تقوم بزيارتها، واختبار مدى نجاح العملية التسويقية لدينا، ومعرفة إذا ما قمت بقراءة البريد الإلكتروني وقمت بالتفاعل مع محتوياته.</p>
                  </div>
                  <div>
                    <strong className="block text-starbucks-dark dark:text-white font-bold">JavaScript</strong>
                    <p>هي رموز برمجية موجودة في عدة أقسام مختلفة من المواقع والتطبيقات التي تسهل مجموعة متنوعة من العمليات بما في ذلك زيادة سرعة التحديث لوظائف معينة أو مراقبة استخدام عدة مواد مختلفة أونلاين.</p>
                  </div>
                  <div>
                    <strong className="block text-starbucks-dark dark:text-white font-bold">EntityTags</strong>
                    <p>هي رموز تحقق HTTP تدعم التخزين المؤقت للبيانات والذي يعمل على تخزين أقسام من المواقع الإلكترونية داخل المتصفح الخاص بك والتحقق من ذاكرة التخزين المؤقتة عند استخدام الموقع، مما يسرع من أداء المواقع الإلكترونية لأن سيرفر الموقع الإلكتروني لا يحتاج إلى إرسال استجابة كاملة إذا لم يتغير المحتوى.</p>
                  </div>
                  <div>
                    <strong className="block text-starbucks-dark dark:text-white font-bold">ملفات التخزين HTML5</strong>
                    <p>تسمح ملفات التخزين HTML5 بتخزين البيانات من المواقع الإلكترونية أو "تخزينها بشكل مؤقت" داخل المتصفح الخاص بك لتخزين واستعادة البيانات بصفحات HTML5 عند زيارة الموقع الإلكتروني مرة ثانية.</p>
                  </div>
                </div>
              </Section>
            </div>

            <div id="section-2">
              <Section title="2. هل عليك السماح بتفعيل ملفات الكوكيز؟">
                <p>
                  كلا ، لا تحتاج للسماح بتفعيل ملفات الكوكيز إلا إذا كان ذلك مطلوباً (أو "عند الضرورة القصوى") لتشغيل المواقع، كما هو موضح أدناه. ومع ذلك، إذا قمت بإلغاء تفعيل ملفات الكوكيز يرجى العلم أنه قد لا يتم تحميل الموقع بشكل كامل وقد تواجه بعض المشاكل والصعوبات أثناء تصفح الموقع.
                </p>
              </Section>
            </div>

            <div id="section-3">
              <Section title="3. هل هناك مصطلحات أساسية يجب عليك معرفتها؟">
                <p>
                  نعم، هناك مصطلحات محددة يجب عليك معرفتها وفهمها لتتمكن من تغيير بعض الإعدادات الخاصة باستخدام ملفات الكوكيز. يتضمن ذلك ملفات كوكيز الطرف الأول والطرف الثالث وملفات كوكيز الذاكرة المؤقتة وملفات الكوكيز الدائمة.
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <strong className="block text-starbucks-dark dark:text-white font-bold">ملفات كوكيز الطرف الأول والطرف الثالث</strong>
                    <p>
                      سواء كان ملف الكوكيز للطرف "الأول" أو "الثالث" فهذا يشير إلى نطاق إعدادات ملفات الكوكيز. وهذا يعني بأن ملفات كوكيز الطرف الأول هي ملفات كوكيز يتم إعدادها عن طريق النظام المشغّل للموقع أو التطبيق أثناء التصفح من قبل المستخدم (على سبيل المثال: ملف الكوكيز الذي يتم إعداده عن طريق www.starbucks.eg). ملفات كوكيز الطرف الثالث هي ملفات كوكيز يتم إعدادها من موقع مختلف عن الموقع أو التطبيق الذي تستخدمه، مثل مزود تحليلات البيانات الموجود على الموقع. عندما تستخدم مواقعنا، فإننا قد نسمح لطرف ثالث بالحصول على بيانات الجهاز ومعلومات الاستخدام ومعلومات موقعك عبر أجهزتك المختلفة من خلال مجموعات تطوير برامج الهاتف الذكي.
                    </p>
                  </div>
                  <div>
                    <strong className="block text-starbucks-dark dark:text-white font-bold">ملفات كوكيز الذاكرة المؤقتة وملفات الكوكيز الدائمة</strong>
                    <p>
                      ملفات كوكيز الذاكرة المؤقتة هي ملفات كوكيز يتم تخزينها بشكل مؤقت وهي تسمح لمشغل الموقع بالتعرف على الإجراءات المتخذة على الموقع أثناء التصفح، ويتم حذف هذه الملفات بمجرد إغلاق المتصفح. أما ملفات الكوكيز الدائمة تبقى محفوظة على متصفح المستخدم أو على الجهاز لفترة زمنية طويلة تنتهي بتاريخ انتهاء صلاحية ملفات الكوكيز.
                    </p>
                  </div>
                </div>
              </Section>
            </div>

            <div id="section-4">
              <Section title="4. ما هي أنواع ملفات الكوكيز التي نستخدمها؟">
                <p>
                  يحدد المخطط البياني أدناه أنواع ملفات الكوكيز المستخدمة من قبل المواقع التي تملكها أو تديرها ستاربكس. يستخدم كل موقع من مواقعنا مجموعة محددة من ملفات الكوكيز المناسبة (غالباً لا تستخدم مواقعنا كافة أنواع ملفات الكوكيز).
                  يمكن تقسيم أنواع ملفات الكوكيز التي نستخدمها نحن ومزودو الخدمات في مواقعنا إلى ثلاث مجموعات رئيسية، كما هو موضح أدناه: ملفات الكوكيز الأساسية، وملفات الكوكيز الوظيفية، وملفات الكوكيز الخاصة بالإعلانات.
                </p>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <strong className="text-lg text-starbucks-dark dark:text-white font-bold border-b-2 border-starbucks-green inline-block pb-1 mb-2">ملفات الكوكيز الأساسية</strong>
                    <p>
                      هي ملفات أساسية ("ضرورية جداً") تستخدم لتشغيل الموقع بشكل صحيح، بما في ذلك أن تسمح لك بالتنقل بين صفحات الموقع واستخدام كافة الميزات الموجودة كما ترغب، كالوصول إلى المناطق الآمنة على مواقعنا. لذلك فإن تفعيل هذه الملفات هو أمر أساسي لا يتطلب موافقتك.
                    </p>
                    <p className="mt-2">
                      نحن نستخدم ملفات الكوكيز هذه لأغراض خدمة طلبات المستخدم، والحفاظ على معلومات سلة التسوق، والتعرف على هويتك عند تسجيل الدخول إلى الموقع، وتذكر منتجاتك المفضلة، والتوثيق، ولأغراض الأمان ومنع حدوث أي احتيال.
                    </p>
                  </div>

                  <div>
                    <strong className="text-lg text-starbucks-dark dark:text-white font-bold border-b-2 border-starbucks-green inline-block pb-1 mb-2">ملفات الكوكيز الوظيفية</strong>
                    <p>
                      تقوم ملفات الكوكيز الوظيفية بالحصول على معلومات حول كيفية استخدام موقعنا من قبل المستخدم والصفحات التي يتصفحها المستخدم بشكل متكرر، ورسائل الخطأ التي يستلمها، ومعلومات تحليلية أخرى.
                    </p>
                    <p className="mt-2">
                      تسمح لنا هذه الملفات الوظيفية بمعرفة عدد المرات التي يقوم المستخدم بزيارة صفحتنا ومصادر حركة مرور الويب وعدد العمليات التي تتم في موقعنا حتى نتمكن من قياس أداء موقعنا والعمل على تطويره. عند معرفة الصفحات الأكثر / والأقل استخداماً، وما هي أكثر المحتويات استخداماً داخل الموقع، نتمكن من إنشاء الصفحات التي يفضلها المستخدمون والتي تخدمهم بشكل أفضل. يتم جمع هذه المعلومات بواسطة ملفات الكوكيز الوظيفية.
                    </p>
                    <p className="mt-2">
                      تسمح ملفات الكوكيز الوظيفية أيضاً للموقع بحفظ جميع الخيارات التي يختارها المستخدم (مثل اللغة أو المنطقة التي يوجد فيها المستخدم) وتقدم ميزات متطورة ومتخصصة أكثر. يمكن لملفات الكوكيز الوظيفية أيضاً حفظ التغييرات التي قام بها المستخدم على حجم النص ونوع الخط المستخدم، أو تقديم الخدمات التي يطلبها المستخدم، مثل مشاهدة مقطع فيديو أو ترك تعليق على الموقع.
                    </p>
                    <p className="mt-2">
                      الهدف من هذه الملفات هو حفظ الأشياء المفضلة لديك والخيارات لتجربة تصفح سهلة ومميزة.
                    </p>
                  </div>
                </div>
              </Section>
            </div>

            <div id="section-5">
              <Section title="5. ما هي المعلومات الأخرى التي نحصل عليها باستخدام ملفات الكوكيز؟">
                <div className="space-y-4">
                  <div>
                    <strong className="block text-starbucks-dark dark:text-white font-bold">معلومات جهاز الكمبيوتر والاستخدام</strong>
                    <p>
                      قد نجمع معلومات عن المتصفح الخاص بك أو جهازك. قد تتضمن هذه المعلومات نوع الجهاز الذي تستخدمه، ونظام التشغيل الخاص بك، والمتصفح، ومزود خدمة الانترنت، واسم النطاق، وعنوان بروتوكول الإنترنت ("IP") الخاص بك، وبرامج تعريف إعلانات الجهاز والهاتف الذكي (على سبيل المثال Apple IDFA أو Android AAID)، والموقع الإلكتروني الذي من خلاله قمت بزيارة موقعنا، وصفحات موقعنا التي قمت بزيارتها (بما في ذلك تاريخ ووقت التصفح)، الخدمات أو الوظائف التي قمت بالوصول إليها أو استخدمتها على موقعنا (بما في ذلك تاريخ ووقت وصولك للموقع أو استخدامك له)، والإعلانات التي تضغط عليها أو التي تقوم بالمرور عليها.
                    </p>
                  </div>
                  <div>
                    <strong className="block text-starbucks-dark dark:text-white font-bold">معلومات الموقع</strong>
                    <p>
                      قد نجمع معلومات حول موقع جهازك، كالمعلومات التي تحدد موقعك تماماً (على سبيل المثال، مستوى خط الطول وخط العرض GPS) أو موقعك التقريبي (على سبيل المثال، الموقع التقريبي يتم تقديره اعتماداً على عنوان بروتوكول الإنترنت لمتصفح أو جهاز المستخدم). قد نستخدم تقنية تعتمد على معلومات الموقع في المواقع الإلكترونية للبيع بالتجزئة لدينا، مثل تقنية iBeacons للحصول على معلومات عن مكان تواجدك من خلال هاتفك الذكي عند تشغيل خاصية البلوتوث لديك وإذا كانت إعدادات جهازك تسمح بذلك.
                    </p>
                    <p className="mt-2">
                      نحن نحصل على معلومات موقعك هذه من خلال نظام تحديد الموقع GPS، نظام واي فاي، بلوتوث أو أي إعدادات أجهزة أخرى لأغراض تدعم وتعزز خدماتنا مثل إعداد وظائف مواقعنا لنرسل لك معلومات عن أقرب محلاتنا إليك، لتتمكن من طلب وتسوق منتجاتنا وخدماتنا عن بُعد، أو لتتمكن من الحصول على منتجات محددة من ستاربكس عن طريق طرف ثالث.
                    </p>
                    <p className="mt-2">
                      قد نستخدم أيضاً معلومات حول موقع جهازك الذي تستخدمه لمساعدتنا في متابعة طريقة عمل مواقعنا والخدمات الأخرى لتطويرها باستمرار لخدمتك بشكل أفضل، أو لتقديم إعلانات تناسبك أكثر وتعرض لك منتجاتك المفضلة بما في ذلك عروض التسويق أو الرسائل المخصصة لك اعتماداً على معلومات موقعك أو معلومات أخرى مثل الوقت أو حالة الطقس.
                    </p>
                  </div>
                </div>
              </Section>
            </div>

            <div id="section-6">
              <Section title="6. هل يمكنك تغيير إعدادات ملفات الكوكيز الخاصة بك؟">
                <p>
                  نعم، يمكنك تغيير الإعدادات الخاصة بملفات الكوكيز بما يناسبك على موقعنا بأي وقت من خلال تحميل منصة إدارة الموافقة بالضغط على زر إشعارات الكوكيز الموجود في أسفل الصفحة.
                </p>
              </Section>
            </div>

            <div id="section-7">
              <Section title="7. هل هناك طرق أخرى لإلغاء الاشتراك بخدمة ملفات الكوكيز؟">
                <p>
                  نعم، هناك منصات خاصة لإلغاء الاشتراك يمكنك استخدامها لإلغاء اشتراكك من ملفات الكوكيز – وكذلك لإلغاء الاشتراك من قبل مزودي الخدمات غير المتواجدين على موقعنا. يمكنك الاطلاع على روابط العديد من هذه المنصات أدناه:
                </p>
                <ul className="mt-3 space-y-2 pr-4 list-disc marker:text-starbucks-green">
                  <li>
                    تسمح معظم متصفحات المواقع الإلكترونية بالتحكم بإعدادات ملفات الكوكيز من خلال إعدادات المتصفح. لمعرفة الطريقة الصحيحة لتعديل إعدادات المتصفح، يرجى استخدام قائمة المساعدة في المتصفح الخاص بك أو اتباع التعليمات عبر الانترنت من خلال المتصفحات التالية: Internet Explorer ، و Google Chrome ، و Mozilla Firefox ، و Safari Desktop ، و Safari Mobile ؛ ومتصفح Android.
                  </li>
                  <li>
                    لإلغاء الاشتراك من تتبع Google Analytics عبر كافة المواقع الإلكترونية، يمكنك زيارة الرابط <a href="https://tools.google.com/dlpage/gaoptout" dir="ltr" className="inline-block text-starbucks-green hover:underline">https://tools.google.com/dlpage/gaoptout</a>
                  </li>
                  <li>
                    يمكن للأشخاص المقيمين في الاتحاد الأوروبي إلغاء الاشتراك في الإعلانات عبر زيارة <a href="https://www.youronlinechoices.eu" dir="ltr" className="inline-block text-starbucks-green hover:underline">https://www.youronlinechoices.eu</a>
                  </li>
                  <li>
                    لإلغاء الاشتراك في جمع البيانات للإعلانات عبر تطبيقات الهاتف الذكي، حمّل تطبيق DDA's AppChoices لإلغاء الاشتراك عبر الرابط: <a href="https://youradchoices.com/appchoices" dir="ltr" className="inline-block text-starbucks-green hover:underline">https://youradchoices.com/appchoices</a>
                  </li>
                </ul>
                <div className="mt-4">
                  <strong className="block text-starbucks-dark dark:text-white font-bold">تقنية Adobe Flash Player</strong>
                  <p>
                    نحن نسمح لبرامج Adobe بإعداد وتفعيل ملفات الكوكيز الضرورية لتقديم محتوى الفيديو عن طريق برنامج Adobe Flash Player. لا يمكن إزالة ملفات الكوكيز الخاصة ببرنامج Flash عن طريق تغيير إعدادات المتصفح الخاص بك. لمعرفة المزيد يمكنك زيارة موقع Adobe عبر الرابط: <a href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html" dir="ltr" className="inline-block text-starbucks-green hover:underline truncate w-full sm:w-auto overflow-hidden text-ellipsis align-bottom">http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html</a>
                  </p>
                </div>
                <div className="mt-4">
                  <strong className="block text-starbucks-dark dark:text-white font-bold">تقنية "عدم التعقب"</strong>
                  <p>
                    تحتوي بعض المتصفحات الحديثة على إعداد "عدم التعقب" الذي ينقل عنوان "عدم التعقب" إلى المواقع الإلكترونية التي تزورها مع معلومات تشير إلى أنك لا تريد أن تقوم ملفات الكوكيز بتعقب نشاطك. يرجى العلم أنه في الوقت الحالي هذه التقنية غير فعالة حيث لا تتم الاستجابة "لعدم التعقب" لأنه ليس هناك طريقة واضحة عن كيفية استجابة الخدمات عبر الإنترنت لمثل هذه الإشارات.
                  </p>
                </div>
              </Section>
            </div>

            <div id="section-8">
              <Section title="8. كيف يمكنني الحصول على المزيد من المعلومات؟">
                <p>
                  لمزيد من المعلومات والتفاصيل حول ملفات الكوكيز يمكنك زيارة الموقع: <a href="http://www.allaboutcookies.org/" dir="ltr" className="inline-block text-starbucks-green hover:underline font-bold">www.allaboutcookies.org</a>
                </p>
              </Section>
            </div>

          </motion.article>

        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-extrabold text-starbucks-dark dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-2">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

export default CookieNoticePage
