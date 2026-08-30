import { useTranslation } from 'react-i18next'

function EnglishContent() {
  return (
    <>
      <h1 className="font-['Cormorant_Garamond'] text-4xl italic mb-6">
        Privacy Policy &amp; Consent to Processing
      </h1>
      <p className="text-[var(--muted)] text-sm mb-8">Last updated: 2026-08-30</p>

      <h2>1. General purpose</h2>
      <p>
        This document describes how Palate ("we", "the Service") collects, uses, and protects
        information about visitors and users of palatelearn.ru and palatelearn.com (together,
        "the Site"), and sets out your consent to that processing, in accordance with Federal Law
        No. 152-FZ "On Personal Data". It applies to all visitors, regardless of whether they
        create a journal entry, use the tasting planner, or simply browse the Learn section.
      </p>

      <h2>2. Purposes of collecting personal data</h2>
      <p>We collect and process data for the following purposes only:</p>
      <ul>
        <li>To understand how visitors use the Site, so we can improve its content and design (site analytics).</li>
        <li>To operate features you actively choose to use, such as generating a tasting plan (planned; not yet live — see §5).</li>
      </ul>
      <p>
        We do not sell personal data to third parties, and we do not use it for targeted
        advertising.
      </p>

      <h2>3. Your consent</h2>
      <p>
        By clicking "Accept" on the cookie/analytics banner shown on your first visit, you
        consent to the processing described in this document — specifically, the analytics data
        listed in §4 below, processed by Google and Yandex on our behalf as described in §6. This
        consent remains valid until withdrawn: you may withdraw it at any time by clearing your
        browser's local storage for this Site, which resets the banner and stops any further
        analytics collection until you consent again. If you decline or withdraw consent, no
        analytics data is collected, and the Site remains fully usable either way — accepting or
        declining does not affect access to any Learn module, the journal, or the tasting
        planner.
      </p>

      <h2>4. What data is collected, and from whom</h2>
      <p>
        Only visitors who accept the cookie/analytics banner are subject to the collection
        described below. If you decline, no analytics scripts load and no data described in
        this section is collected.
      </p>
      <ul>
        <li>
          <strong>Analytics data (Google Analytics, Yandex Metrica):</strong> pages visited,
          navigation paths, approximate device/browser type, approximate location (city-level,
          derived from IP address), and on-page interactions (clicks, scroll depth). Yandex
          Metrica's Webvisor feature additionally records anonymized session replays of on-page
          interactions for the same purpose.
        </li>
        <li>
          <strong>Locally-stored app data:</strong> your journal entries, lesson progress, and
          quiz scores are stored only in your own browser's local storage. This data is never
          transmitted to us or to any third party — we have no access to it.
        </li>
      </ul>

      <h2>5. Tasting planner (future feature)</h2>
      <p>
        The Site includes a tasting-planner form, currently shown as disabled ("Coming soon") and
        not yet transmitting any data anywhere. When we enable it, any wines, food, guest
        details, or notes you enter into the planner form will be sent to our AI provider (to be
        selected) solely to generate your tasting plan, and will not be stored by us beyond what
        is needed to display your result to you. We will update this policy, naming the
        provider, before that feature goes live.
      </p>

      <h2>6. Order and conditions of processing</h2>
      <p>
        Analytics data is processed by our sub-processors — Google (Google Analytics) and
        Yandex (Yandex Metrica) — under their own respective terms of service, for the sole
        purpose of generating the aggregate/behavioral analytics described above. Google Tag
        Manager, which the Site also uses, is a delivery mechanism only — it loads the Google
        Analytics and Yandex Metrica tags but does not itself process or store any data. We do
        not combine this data with any information that directly identifies you (such as your
        name or email), because the Site does not currently collect such information from any
        visitor.
      </p>

      <h2>7. Updating, correcting, deleting your data, and your requests</h2>
      <p>
        Since analytics data is collected by our sub-processors and locally-stored data never
        leaves your device, most corrections/deletions are entirely in your control:
      </p>
      <ul>
        <li>To delete locally-stored app data (journal, progress), clear your browser's local storage for this Site, or use your browser's site-data settings.</li>
        <li>To withdraw analytics consent, see §3.</li>
        <li>
          For any other request regarding your personal data — including a request to know what
          data we hold, or to have it corrected or deleted — please contact us at the address
          below, and we will respond within the timeframe required by applicable law.
        </li>
      </ul>

      <h2>8. Contact</h2>
      <p>
        palatelearn@yandex.com
      </p>
    </>
  )
}

function RussianContent() {
  return (
    <>
      <h1 className="font-['Cormorant_Garamond'] text-4xl italic mb-6">
        Политика обработки персональных данных и согласие на обработку
      </h1>
      <p className="text-[var(--muted)] text-sm mb-8">Последнее обновление: 30.08.2026</p>

      <h2>1. Общие положения</h2>
      <p>
        Настоящий документ описывает, как Palate («мы», «Сервис») собирает, использует и защищает
        информацию о посетителях и пользователях сайтов palatelearn.ru и palatelearn.com (далее —
        «Сайт»), а также определяет ваше согласие на такую обработку в соответствии с Федеральным
        законом № 152-ФЗ «О персональных данных». Документ распространяется на всех посетителей —
        независимо от того, ведёте ли вы записи в дневнике, используете планировщик дегустаций
        или просто просматриваете раздел «Обучение».
      </p>

      <h2>2. Цели сбора персональных данных</h2>
      <p>Мы собираем и обрабатываем данные исключительно для следующих целей:</p>
      <ul>
        <li>чтобы понять, как посетители используют Сайт, и улучшать его содержание и оформление (аналитика сайта);</li>
        <li>чтобы предоставлять функции, которые вы сами решаете использовать, например составление плана дегустации (функция запланирована, пока не запущена — см. §5).</li>
      </ul>
      <p>
        Мы не продаём персональные данные третьим лицам и не используем их для целевой рекламы.
      </p>

      <h2>3. Ваше согласие</h2>
      <p>
        Нажимая «Принять» в баннере о cookie-файлах и аналитике, который отображается при первом
        посещении, вы даёте согласие на обработку данных, описанную в настоящем документе —
        а именно аналитических данных, перечисленных в §4, которые обрабатываются в наших
        интересах компаниями Google и «Яндекс» согласно §6. Согласие действует до его отзыва: вы
        можете отозвать согласие в любой момент, очистив локальное хранилище браузера для этого
        Сайта — это сбросит баннер и прекратит дальнейший сбор аналитических данных до повторного
        согласия. Если вы отклоняете или отзываете согласие, аналитические данные не собираются, а
        Сайт остаётся полностью доступен в любом случае — согласие или отказ не влияют на доступ к
        разделам «Обучение», дневнику или планировщику дегустаций.
      </p>

      <h2>4. Какие данные собираются и от кого</h2>
      <p>
        Сбор данных, описанный ниже, происходит только в отношении посетителей, принявших баннер
        о cookie-файлах и аналитике. Если вы отклоняете баннер, аналитические скрипты не
        загружаются, и данные, описанные в этом разделе, не собираются.
      </p>
      <ul>
        <li>
          <strong>Аналитические данные (Google Analytics, Яндекс.Метрика):</strong> посещённые
          страницы, маршруты навигации, приблизительный тип устройства/браузера, приблизительное
          местоположение (на уровне города, определяется по IP-адресу), а также действия на
          странице (клики, глубина прокрутки). Функция Вебвизор Яндекс.Метрики дополнительно
          записывает анонимизированные записи сессий с действиями на странице для тех же целей.
        </li>
        <li>
          <strong>Данные, хранящиеся локально в приложении:</strong> записи вашего дневника,
          прогресс по урокам и результаты викторины хранятся только в локальном хранилище вашего
          браузера. Эти данные никогда не передаются нам или третьим лицам — у нас нет доступа к
          ним.
        </li>
      </ul>

      <h2>5. Планировщик дегустаций (будущая функция)</h2>
      <p>
        Сайт включает форму планировщика дегустаций, которая сейчас отображается как отключённая
        («Скоро») и пока никуда не передаёт никакие данные. Когда мы её включим, любые данные о
        винах, еде, гостях или заметки, которые вы вводите в форму планировщика, будут отправлены
        нашему поставщику ИИ-услуг (будет определён) исключительно для составления плана
        дегустации и не будут храниться нами дольше, чем необходимо для показа результата вам. Мы
        обновим эту политику, указав поставщика, до запуска этой функции.
      </p>

      <h2>6. Порядок и условия обработки</h2>
      <p>
        Аналитические данные обрабатываются нашими субподрядчиками по обработке данных — Google
        (Google Analytics) и «Яндекс» (Яндекс.Метрика) — в соответствии с их собственными
        условиями использования, исключительно с целью формирования агрегированной/поведенческой
        аналитики, описанной выше. Google Tag Manager, который также используется на Сайте,
        служит только механизмом доставки — он загружает теги Google Analytics и Яндекс.Метрики,
        но сам не обрабатывает и не хранит данные. Мы не объединяем эти данные с информацией,
        которая напрямую идентифицирует вас (например, имя или email), поскольку Сайт в настоящее
        время не собирает такую информацию ни от одного посетителя.
      </p>

      <h2>7. Обновление, исправление, удаление данных и обращения</h2>
      <p>
        Поскольку аналитические данные собираются нашими субподрядчиками, а данные, хранящиеся
        локально, никогда не покидают ваше устройство, большинство исправлений и удалений
        полностью в вашем контроле:
      </p>
      <ul>
        <li>чтобы удалить данные приложения, хранящиеся локально (дневник, прогресс), очистите локальное хранилище браузера для этого Сайта или используйте настройки данных сайта в браузере;</li>
        <li>чтобы отозвать согласие на аналитику, см. §3;</li>
        <li>
          по любому другому запросу, касающемуся ваших персональных данных — включая запрос о том,
          какие данные мы храним, а также об их исправлении или удалении, — обращайтесь по адресу,
          указанному ниже; мы ответим в срок, установленный применимым законодательством.
        </li>
      </ul>

      <h2>8. Контакты</h2>
      <p>
        palatelearn@yandex.com
      </p>
    </>
  )
}

export default function PrivacyPolicy() {
  const { i18n } = useTranslation()
  const isRussian = i18n.language?.startsWith('ru')

  return (
    <div
      className="max-w-2xl mx-auto px-4 pt-12 pb-16 text-sm text-[var(--ink-soft)] leading-relaxed [&_h2]:font-['Inter'] [&_h2]:font-medium [&_h2]:text-base [&_h2]:text-[var(--ink)] [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:mt-0 [&_a]:underline [&_a]:text-[var(--forest)]"
    >
      {isRussian ? <RussianContent /> : <EnglishContent />}
    </div>
  )
}
