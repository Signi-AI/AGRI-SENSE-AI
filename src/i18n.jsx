import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const translations = {
  EN: {
    // =====================================================
    // GENERAL
    // =====================================================
    appName: 'AgriSense AI',
    tagline: 'AI-Powered Precision Agriculture',
    smartFarming: 'Smart Farming. Better Harvests.',

    home: 'Home',
    about: 'About Us',
    offer: 'What We Offer',
    serve: 'What We Serve',
    impact: 'Our Impact',
    solution: 'Solution',
    contact: 'Contact us',

    learnMore: 'Learn More',
    getStarted: 'Get Started',
    explore: 'Explore',
    watch: 'Explore Our Solution',

    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    edit: 'Edit',
    view: 'View',
    delete: 'Delete',
    confirm: 'Confirm',
    search: 'Search',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    yes: 'Yes',
    no: 'No',

    loading: 'Loading...',
    success: 'Success',
    error: 'Error',

    language: 'Language',
    english: 'English',
    kiswahili: 'Kiswahili',

    // =====================================================
    // NAVIGATION
    // =====================================================
    dashboard: 'Dashboard',
    workspace: 'Workspace',
    farms: 'Farms',
    soil: 'Soil Health',
    weather: 'Weather',
    advisor: 'AI Advisor',
    crop: 'Crop Recommendation',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    privacy: 'Privacy & Security',
    logout: 'Logout',

    // =====================================================
    // AUTHENTICATION
    // =====================================================
    login: 'Login',
    signup: 'Create Account',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phone: 'Phone Number',

    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',

    signIn: 'Sign In',
    createAccount: 'Create Account',
    continueGoogle: 'Continue with Google',

    welcomeBack: 'Welcome back to AgriSense ai',
    createYourAccount: 'Create your AgriSense AI account',

    loginDesc:
      'Sign in to access your agricultural intelligence platform.',

    signupDesc:
      'Create your account and start managing your farm with AI.',

    farmer: 'Farmer',
    admin: 'Admin',
    agronomist: 'Agronomist',

    // =====================================================
    // DASHBOARD
    // =====================================================
    welcome: 'Welcome',
    overview: 'Farm Overview',
    farmOverview: 'Farm Overview',
    farmHealth: 'Farm Health',

    soilHealth: 'Soil Health',
    environmentalConditions: 'Environmental Conditions',
    currentConditions: 'Current Conditions',

    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    farmStatus: 'Farm Status',

    healthy: 'Healthy',
    attention: 'Needs Attention',

    lastUpdated: 'Last updated',
    today: 'Today',

    temperature: 'Temperature',
    humidity: 'Humidity (%)',
    rainfall: 'Rainfall',
    waterPh: 'Water pH',
    soilPh: 'Soil pH',

    nitrogen: 'Nitrogen',
    phosphorus: 'Phosphorus',
    potassium: 'Potassium',

    // =====================================================
    // SOIL DIAGNOSIS
    // =====================================================
    diagnosis: 'Soil Diagnosis',

    diagnosisDesc:
      'Analyze soil conditions, nutrient levels and environmental factors to understand your farm’s soil health.',

    soilParameters: 'Soil Parameters',

    soilParametersDesc:
      'Enter or edit your soil data before running diagnosis.',

    waterVolume: 'Water Volume',
    soilType: 'Soil Type',
    cropType: 'Crop',

    runDiagnosis: 'Run Diagnosis',
    diagnosing: 'Analyzing Soil...',

    good: 'Good',
    poor: 'Needs Attention',

    recommendedCorrections:
      'Recommended Corrections',

    problemsDetected: 'Issues detected',

    soilAnalysisTitle:
      'AI-Powered Soil Analysis',

    soilAnalysisDesc:
      'AgriSense AI analyzes soil conditions, nutrient levels and environmental factors to provide data-driven insights that support better crop and farm management decisions.',

    // =====================================================
    // SOIL VALUES / LABELS
    // =====================================================
    ph: 'Soil pH',
    ph_ya_maji: 'Water pH',

    N: 'Nitrogen (N)',
    P: 'Phosphorus (P)',
    K: 'Potassium (K)',

    // =====================================================
    // AI CROP INTELLIGENCE
    // =====================================================
    aiCropIntelligence:
      'AI Crop Intelligence',

    cropDesc:
      'Enter soil and environmental readings to receive an AI-powered crop recommendation based on your farm conditions.',

    analyze: 'Get Crop Recommendation',
    analyzing: 'Analyzing Farm Data...',

    recommendationResult:
      'Crop Recommendation',

    suitability: 'suitability',

    recommendationInsight:
      'Based on the farm conditions provided, AgriSense AI has analyzed the available soil and environmental data to identify suitable crop options.',

    // =====================================================
    // AI ADVISOR
    // =====================================================
    intelligence:
      'Agricultural Intelligence',

    askFarm:
      'Ask about your farm...',

    advisorWelcome:
      'Hello! I am your AgriSense AI Advisor. Ask about crop selection, soil readings, irrigation or farm monitoring.',

    advisorResponse:
      'AgriSense AI is analyzing your farm information to provide relevant agricultural guidance.',

    suggestedQuestions:
      'Suggested questions',

    send: 'Send',

    listening: 'Listening...',
    stopListening: 'Stop listening',
    startMicrophone: 'Start microphone',

    microphoneUnavailable:
      'Speech recognition is not available in this browser. Please use Google Chrome or Microsoft Edge.',

    microphonePermission:
      'Microphone access could not be obtained. Please allow microphone access in your browser.',

    typing:
      'AgriSense AI is responding...',

    chatError:
      'Sorry, we could not get a response right now. Please try again later.',

    deleteMessage:
      'Delete message',

    // =====================================================
    // WEATHER
    // =====================================================
    weatherTitle:
      'Weather Intelligence',

    weatherDesc:
      'Monitor weather conditions and environmental changes to support better farm decisions.',

    currentWeather:
      'Current Weather',

    forecast: 'Forecast',

    rainfallForecast:
      'Rainfall Forecast',

    windSpeed: 'Wind Speed',

    precipitation:
      'Precipitation',

    weatherAlert:
      'Weather Alert',

    weatherUpdated:
      'Weather information updated',

    // =====================================================
    // FARMS
    // =====================================================
    myFarms: 'My Farms',
    addFarm: 'Add Farm',

    farmName: 'Farm Name',
    location: 'Location',
    size: 'Farm Size',

    soilTexture:
      'Soil Texture',

    coordinates:
      'GPS Coordinates',

    latitude: 'Latitude',
    longitude: 'Longitude',

    getLocation:
      'Get Current Location',

    locationCaptured:
      'Location captured successfully',

    locationError:
      'Unable to get your current location.',

    loamy: 'Loamy',
    sandyLoam: 'Sandy Loam',
    clay: 'Clay',
    sandy: 'Sandy',

    farmDetails:
      'Farm Details',

    farmInformation:
      'Farm Information',

    hectares: 'hectares',

    noFarms:
      'No farms added yet.',

    addYourFirstFarm:
      'Add your first farm',

    // =====================================================
    // NOTIFICATIONS
    // =====================================================
    updates: 'Updates',

    notificationsTitle:
      'Notifications',

    sensorReady:
      'Sensor Integration',

    sensorReadyDesc:
      'Monitor live farm conditions and sensor data through the AgriSense AI platform.',

    nutrientAlert:
      'Soil Nutrient Attention',

    nutrientAlertDesc:
      'Potassium reading needs review.',

    stable:
      'Farm Health Stable',

    stableDesc:
      'Your current farm readings are within the recommended range.',

    markRead:
      'Mark as read',

    clearAll:
      'Clear all',

    // =====================================================
    // PROFILE
    // =====================================================
    profileTitle: 'Profile',

    personalInformation:
      'Personal Information',

    accountInformation:
      'Account Information',

    updateProfile:
      'Update Profile',

    changePassword:
      'Change Password',

    role: 'Role',

    // =====================================================
    // SETTINGS
    // =====================================================
    preferences:
      'Preferences',

    appearance:
      'Appearance',

    theme:
      'Theme',

    system:
      'System',

    light:
      'Light',

    dark:
      'Dark',

    account:
      'Account',

    security:
      'Security',

    saveChanges:
      'Save Changes',

    settingsSaved:
      'Settings saved successfully.',

    // =====================================================
    // LOGOUT
    // =====================================================
    logoutConfirmTitle:
      'Are you sure you want to logout?',

    logoutConfirmDesc:
      'You will need to sign in again to access your AgriSense AI account.',

    cancelLogout:
      'Cancel',

    confirmLogout:
      'Yes, Logout',

    // =====================================================
    // PRIVACY & SECURITY
    // =====================================================
    privacyTitle:
      'Privacy & Security',

    privacyDesc:
      'Manage your account privacy and security preferences.',

    dataProtection:
      'Data Protection',

    accountSecurity:
      'Account Security',

    secureAccount:
      'Your account information is protected using secure authentication practices.',

    // =====================================================
    // CONTACT
    // =====================================================
    contactTitle:
      'Contact Us',

    contactDesc:
      'Have questions, feedback or need agricultural guidance? Get in touch with the AgriSense AI team.',

    message:
      'Message',

    sendMessage:
      'Send Message',

    contactFormNote:
      'Send us a message and our team will get back to you.',

    messageSent:
      'Your message has been sent successfully.',

    // =====================================================
    // LANDING PAGE
    // =====================================================
    heroTitle:
      'Smart Farming. Better Harvests.',

    heroDesc:
      'AgriSense AI brings intelligent agricultural insights to farmers through soil analysis, weather intelligence, crop recommendations and AI-powered farm guidance.',

    aboutTitle:
      'About AgriSense AI',

    aboutDesc:
      'AgriSense AI is an intelligent agriculture platform designed to help farmers make better decisions using farm data, sensors, weather intelligence and artificial intelligence.',

    aboutText:
      'AgriSense AI connects agricultural data, sensors, weather intelligence and artificial intelligence to help farmers understand their farms and make informed decisions.',

    offerTitle:
      'What We Offer',

    offerDesc:
      'Practical agricultural intelligence designed around the real needs of modern farmers.',

    serveTitle:
      'What We Serve',

    serveDesc:
      'AgriSense AI supports farmers with insights across soil health, crops, weather and farm management.',

    impactTitle:
      'Our Impact',

    impactDesc:
      'We help farmers turn agricultural data into useful insights for more informed farm management.',

    solutionTitle:
      'Our Solution',

    solutionDesc:
      'A connected agricultural intelligence platform that brings farm information and AI-powered guidance together.',

    solutionText:
      'AgriSense AI combines sensor readings, soil information, environmental conditions and artificial intelligence into one connected workflow for smarter farm management.',

    contactSectionTitle:
      'Let’s Grow Smarter Together',

    contactSectionDesc:
      'Connect with AgriSense AI and discover intelligent ways to improve your farming decisions.',

    ready:
      'READY FOR SMARTER FARMING?',

    readyTitle:
      'Turn your farm data into better decisions.',

    create:
      'Create Your Account',

    // =====================================================
    // IMPACT
    // =====================================================
    productivity:
      'Better Productivity',

    productivityText:
      'Use agricultural insights to understand farm conditions and support more informed decisions.',

    sustainability:
      'Sustainable Farming',

    sustainabilityText:
      'Support responsible farm management by understanding soil and environmental conditions.',

    food:
      'Food Production',

    foodText:
      'Better agricultural decisions can support healthier crops and more productive farming systems.',

    // =====================================================
    // FEATURES
    // =====================================================
    soilInsights:
      'Soil Insights',

    soilInsightsDesc:
      'Understand soil nutrients, pH and environmental conditions.',

    weatherIntelligence:
      'Weather Intelligence',

    weatherIntelligenceDesc:
      'Monitor weather information that can support farm planning.',

    cropRecommendations:
      'Crop Recommendations',

    cropRecommendationsDesc:
      'Identify crops that are suitable for your farm conditions.',

    aiGuidance:
      'AI-Powered Agricultural Guidance',

    aiGuidanceDesc:
      'Get agricultural guidance through the AgriSense AI Advisor.',

    sensorIntegration:
      'Sensor Integration',

    sensorIntegrationDesc:
      'Connect farm sensors and monitor important environmental conditions.',

    // =====================================================
    // FARMING
    // =====================================================
    maize: 'Maize',
    rice: 'Rice',
    beans: 'Beans',
    tomato: 'Tomato',
    onion: 'Onion',
    carrot: 'Carrot',
    cassava: 'Cassava',
    pepper: 'Pepper',
    ginger: 'Ginger',
    cabbage: 'Cabbage',
    pumpkin: 'Pumpkin',
    eggplant: 'Eggplant',

    // =====================================================
    // COMMON MESSAGES
    // =====================================================
    required:
      'This field is required.',

    invalidEmail:
      'Please enter a valid email address.',

    somethingWentWrong:
      'Something went wrong. Please try again.',

    noData:
      'No data available.',

    connectionError:
      'Unable to connect to the service. Please try again.',
  },

  // =========================================================
  // KISWAHILI
  // =========================================================
  SW: {
    // =====================================================
    // JUMLA
    // =====================================================
    appName: 'AgriSense AI',

    tagline:
      'Kilimo cha Usahihi Kinachoendeshwa na AI',

    smartFarming:
      'Kilimo Bora. Mavuno Bora.',

    home: 'Mwanzo',
    about: 'Kuhusu Sisi',
    offer: 'Tunachotoa',
    serve: 'Tunachohudumia',
    impact: 'Mafanikio Yetu',
    solution: 'Suluhisho',
    contact: 'Mawasiliano',

    learnMore:
      'Jifunze Zaidi',

    getStarted:
      'Anza Sasa',

    explore:
      'Chunguza',

    watch:
      'Chunguza Suluhisho Letu',

    save: 'Hifadhi',
    cancel: 'Ghairi',
    close: 'Funga',
    edit: 'Hariri',
    view: 'Angalia',
    delete: 'Futa',
    confirm: 'Thibitisha',
    search: 'Tafuta',
    submit: 'Tuma',
    back: 'Rudi',
    next: 'Endelea',
    previous: 'Iliyotangulia',

    yes: 'Ndiyo',
    no: 'Hapana',

    loading:
      'Inapakia...',

    success:
      'Imefanikiwa',

    error:
      'Hitilafu',

    language:
      'Lugha',

    english:
      'Kiingereza',

    kiswahili:
      'Kiswahili',

    // =====================================================
    // NAVIGATION
    // =====================================================
    dashboard:
      'Dashibodi',

    workspace:
      'Workspace',

    farms:
      'Mashamba',

    soil:
      'Afya ya Udongo',

    weather:
      'Hali ya Hewa',

    advisor:
      'Mshauri wa AI',

    crop:
      'Pendekezo la Zao',

    notifications:
      'Taarifa',

    profile:
      'Wasifu',

    settings:
      'Mipangilio',

    privacy:
      'Faragha na Usalama',

    logout:
      'Toka',

    // =====================================================
    // AUTHENTICATION
    // =====================================================
    login:
      'Ingia',

    signup:
      'Fungua Akaunti',

    email:
      'Barua Pepe',

    password:
      'Nenosiri',

    confirmPassword:
      'Thibitisha Nenosiri',

    fullName:
      'Jina Kamili',

    phone:
      'Namba ya Simu',

    rememberMe:
      'Nikumbuke',

    forgotPassword:
      'Umesahau nenosiri?',

    noAccount:
      'Huna akaunti?',

    haveAccount:
      'Tayari una akaunti?',

    signIn:
      'Ingia',

    createAccount:
      'Fungua Akaunti',

    continueGoogle:
      'Endelea na Google',

    welcomeBack:
      'Karibu tena',

    createYourAccount:
      'Fungua akaunti yako ya AgriSense AI',

    loginDesc:
      'Ingia ili kufikia mfumo wako wa akili ya kilimo.',

    signupDesc:
      'Fungua akaunti yako na anza kusimamia shamba lako kwa kutumia AI.',

    farmer:
      'Mkulima',

    admin:
      'Msimamizi',

    agronomist:
      'Mtaalamu wa Kilimo',

    // =====================================================
    // DASHBOARD
    // =====================================================
    welcome:
      'Karibu',

    overview:
      'Muhtasari wa Shamba',

    farmOverview:
      'Muhtasari wa Shamba',

    farmHealth:
      'Afya ya Shamba',

    soilHealth:
      'Afya ya Udongo',

    environmentalConditions:
      'Hali ya Mazingira',

    currentConditions:
      'Hali ya Sasa',

    quickActions:
      'Vitendo vya Haraka',

    recentActivity:
      'Shughuli za Hivi Karibuni',

    farmStatus:
      'Hali ya Shamba',

    healthy:
      'Nzuri',

    attention:
      'Inahitaji Uangalizi',

    lastUpdated:
      'Ilisasishwa mwisho',

    today:
      'Leo',

    temperature:
      'Joto',

    humidity:
      'Unyevunyevu (%)',

    rainfall:
      'Mvua',

    waterPh:
      'pH ya Maji',

    soilPh:
      'pH ya Udongo',

    nitrogen:
      'Nitrojeni',

    phosphorus:
      'Fosforasi',

    potassium:
      'Potasiamu',

    // =====================================================
    // SOIL DIAGNOSIS
    // =====================================================
    diagnosis:
      'Utambuzi wa Udongo',

    diagnosisDesc:
      'Chambua hali ya udongo, viwango vya virutubisho na mazingira ili kuelewa afya ya udongo wa shamba lako.',

    soilParameters:
      'Vipimo vya Udongo',

    soilParametersDesc:
      'Ingiza au hariri taarifa za udongo kabla ya kuendesha utambuzi.',

    waterVolume:
      'Kiasi cha Maji',

    soilType:
      'Aina ya Udongo',

    cropType:
      'Zao',

    runDiagnosis:
      'Fanya Utambuzi',

    diagnosing:
      'Inachambua Udongo...',

    good:
      'Nzuri',

    poor:
      'Inahitaji Uangalizi',

    recommendedCorrections:
      'Marekebisho Yanayopendekezwa',

    problemsDetected:
      'Changamoto zilizogundulika',

    soilAnalysisTitle:
      'Uchambuzi wa Udongo kwa AI',

    soilAnalysisDesc:
      'AgriSense AI huchambua hali ya udongo, viwango vya virutubisho na mazingira ili kutoa taarifa zinazotegemea data kwa ajili ya maamuzi bora ya mazao na usimamizi wa shamba.',

    // =====================================================
    // SOIL VALUES
    // =====================================================
    ph:
      'pH ya Udongo',

    ph_ya_maji:
      'pH ya Maji',

    N:
      'Nitrojeni (N)',

    P:
      'Fosforasi (P)',

    K:
      'Potasiamu (K)',

    // =====================================================
    // AI CROP INTELLIGENCE
    // =====================================================
    aiCropIntelligence:
      'Akili ya AI ya Mazao',

    cropDesc:
      'Ingiza vipimo vya udongo na mazingira ili kupata pendekezo la zao linalofaa kulingana na hali ya shamba lako.',

    analyze:
      'Pata Pendekezo la Zao',

    analyzing:
      'Inachambua Taarifa za Shamba...',

    recommendationResult:
      'Pendekezo la Zao',

    suitability:
      'ufanisi',

    recommendationInsight:
      'Kwa kutumia taarifa za shamba ulizowasilisha, AgriSense AI imechambua hali ya udongo na mazingira ili kubaini mazao yanayofaa kwa shamba lako.',

    // =====================================================
    // AI ADVISOR
    // =====================================================
    intelligence:
      'Akili ya Kilimo',

    askFarm:
      'Uliza kuhusu shamba lako...',

    advisorWelcome:
      'Habari! Mimi ni Mshauri wako wa AgriSense AI. Uliza kuhusu uchaguzi wa zao, vipimo vya udongo, umwagiliaji au ufuatiliaji wa shamba.',

    advisorResponse:
      'AgriSense AI inachambua taarifa za shamba lako ili kukupa mwongozo unaohusiana na mahitaji yako ya kilimo.',

    suggestedQuestions:
      'Maswali Yanayopendekezwa',

    send:
      'Tuma',

    listening:
      'Inasikiliza...',

    stopListening:
      'Acha Kusikiliza',

    startMicrophone:
      'Washa Kipaza Sauti',

    microphoneUnavailable:
      'Utambuzi wa sauti haupatikani kwenye browser hii. Tafadhali tumia Google Chrome au Microsoft Edge.',

    microphonePermission:
      'Imeshindikana kupata kipaza sauti. Tafadhali ruhusu matumizi ya kipaza sauti kwenye browser yako.',

    typing:
      'AgriSense AI inajibu...',

    chatError:
      'Samahani, imeshindikana kupata jibu sasa hivi. Jaribu tena baadaye.',

    deleteMessage:
      'Futa ujumbe',

    // =====================================================
    // WEATHER
    // =====================================================
    weatherTitle:
      'Akili ya Hali ya Hewa',

    weatherDesc:
      'Fuatilia hali ya hewa na mabadiliko ya mazingira ili kusaidia kufanya maamuzi bora ya shamba.',

    currentWeather:
      'Hali ya Hewa ya Sasa',

    forecast:
      'Utabiri',

    rainfallForecast:
      'Utabiri wa Mvua',

    windSpeed:
      'Kasi ya Upepo',

    precipitation:
      'Kiwango cha Mvua',

    weatherAlert:
      'Tahadhari ya Hali ya Hewa',

    weatherUpdated:
      'Taarifa za hali ya hewa zimesasishwa',

    // =====================================================
    // FARMS
    // =====================================================
    myFarms:
      'Mashamba Yangu',

    addFarm:
      'Ongeza Shamba',

    farmName:
      'Jina la Shamba',

    location:
      'Eneo',

    size:
      'Ukubwa wa Shamba',

    soilTexture:
      'Muundo wa Udongo',

    coordinates:
      'Viwianishi vya GPS',

    latitude:
      'Latitudo',

    longitude:
      'Longitudo',

    getLocation:
      'Pata Eneo la Sasa',

    locationCaptured:
      'Eneo limepatikana kikamilifu',

    locationError:
      'Imeshindikana kupata eneo lako la sasa.',

    loamy:
      'Tifutifu',

    sandyLoam:
      'Tifutifu ya Mchanga',

    clay:
      'Mfinyanzi',

    sandy:
      'Mchanga',

    farmDetails:
      'Maelezo ya Shamba',

    farmInformation:
      'Taarifa za Shamba',

    hectares:
      'hekta',

    noFarms:
      'Hakuna mashamba yaliyoongezwa bado.',

    addYourFirstFarm:
      'Ongeza shamba lako la kwanza',

    // =====================================================
    // NOTIFICATIONS
    // =====================================================
    updates:
      'Taarifa',

    notificationsTitle:
      'Taarifa',

    sensorReady:
      'Muunganisho wa Sensor',

    sensorReadyDesc:
      'Fuatilia hali halisi ya shamba na taarifa za sensors kupitia mfumo wa AgriSense AI.',

    nutrientAlert:
      'Tahadhari ya Virutubisho vya Udongo',

    nutrientAlertDesc:
      'Kipimo cha potasiamu kinahitaji kuangaliwa.',

    stable:
      'Afya ya Shamba Iko Vizuri',

    stableDesc:
      'Vipimo vya sasa vya shamba lako viko ndani ya kiwango kinachopendekezwa.',

    markRead:
      'Weka kuwa imesomwa',

    clearAll:
      'Futa Zote',

    // =====================================================
    // PROFILE
    // =====================================================
    profileTitle:
      'Wasifu',

    personalInformation:
      'Taarifa Binafsi',

    accountInformation:
      'Taarifa za Akaunti',

    updateProfile:
      'Sasisha Wasifu',

    changePassword:
      'Badilisha Nenosiri',

    role:
      'Jukumu',

    // =====================================================
    // SETTINGS
    // =====================================================
    preferences:
      'Mapendeleo',

    appearance:
      'Mwonekano',

    theme:
      'Mandhari',

    system:
      'Mfumo',

    light:
      'Mwanga',

    dark:
      'Giza',

    account:
      'Akaunti',

    security:
      'Usalama',

    saveChanges:
      'Hifadhi Mabadiliko',

    settingsSaved:
      'Mipangilio imehifadhiwa kikamilifu.',

    // =====================================================
    // LOGOUT
    // =====================================================
    logoutConfirmTitle:
      'Una uhakika unataka kutoka?',

    logoutConfirmDesc:
      'Utahitaji kuingia tena ili kufikia akaunti yako ya AgriSense AI.',

    cancelLogout:
      'Ghairi',

    confirmLogout:
      'Ndiyo, Toka',

    // =====================================================
    // PRIVACY
    // =====================================================
    privacyTitle:
      'Faragha na Usalama',

    privacyDesc:
      'Simamia faragha ya akaunti yako na mipangilio ya usalama.',

    dataProtection:
      'Ulinzi wa Taarifa',

    accountSecurity:
      'Usalama wa Akaunti',

    secureAccount:
      'Taarifa za akaunti yako zinalindwa kwa kutumia njia salama za uthibitishaji.',

    // =====================================================
    // CONTACT
    // =====================================================
    contactTitle:
      'Wasiliana Nasi',

    contactDesc:
      'Una swali, maoni au unahitaji mwongozo wa kilimo? Wasiliana na timu ya AgriSense AI.',

    message:
      'Ujumbe',

    sendMessage:
      'Tuma Ujumbe',

    contactFormNote:
      'Tuma ujumbe wako na timu yetu itawasiliana nawe.',

    messageSent:
      'Ujumbe wako umetumwa kikamilifu.',

    // =====================================================
    // LANDING PAGE
    // =====================================================
    heroTitle:
      'Kilimo Bora. Mavuno Bora.',

    heroDesc:
      'AgriSense AI huwapa wakulima taarifa mahiri za kilimo kupitia uchambuzi wa udongo, akili ya hali ya hewa, mapendekezo ya mazao na mwongozo wa kilimo unaoendeshwa na AI.',

    aboutTitle:
      'Kuhusu AgriSense AI',

    aboutDesc:
      'AgriSense AI ni mfumo wa akili ya kilimo unaosaidia wakulima kufanya maamuzi bora kwa kutumia taarifa za mashamba, sensors, akili ya hali ya hewa na artificial intelligence.',

    aboutText:
      'AgriSense AI huunganisha taarifa za kilimo, sensors, akili ya hali ya hewa na artificial intelligence ili kuwasaidia wakulima kuelewa mashamba yao na kufanya maamuzi yenye taarifa sahihi.',

    offerTitle:
      'Tunachotoa',

    offerDesc:
      'Akili ya kilimo inayolenga mahitaji halisi ya wakulima wa kisasa.',

    serveTitle:
      'Tunachohudumia',

    serveDesc:
      'AgriSense AI huwasaidia wakulima kupata taarifa kuhusu afya ya udongo, mazao, hali ya hewa na usimamizi wa shamba.',

    impactTitle:
      'Mafanikio Yetu',

    impactDesc:
      'Tunawasaidia wakulima kubadilisha taarifa za kilimo kuwa maarifa yanayoweza kusaidia katika usimamizi bora wa mashamba.',

    solutionTitle:
      'Suluhisho Letu',

    solutionDesc:
      'Mfumo jumuishi wa akili ya kilimo unaounganisha taarifa za shamba na mwongozo unaoendeshwa na AI.',

    solutionText:
      'AgriSense AI huunganisha taarifa za sensors, udongo, mazingira na artificial intelligence katika mfumo mmoja unaosaidia usimamizi bora na maamuzi mahiri ya kilimo.',

    contactSectionTitle:
      'Tujenge Kilimo Bora Pamoja',

    contactSectionDesc:
      'Wasiliana na AgriSense AI na ugundue njia mahiri za kuboresha maamuzi yako ya kilimo.',

    ready:
      'TAYARI KWA KILIMO MAHIRI?',

    readyTitle:
      'Geuza taarifa za shamba lako kuwa maamuzi bora.',

    create:
      'Fungua Akaunti Yako',

    // =====================================================
    // IMPACT
    // =====================================================
    productivity:
      'Uzalishaji Bora',

    productivityText:
      'Tumia taarifa za kilimo kuelewa hali ya shamba na kusaidia kufanya maamuzi yenye taarifa zaidi.',

    sustainability:
      'Kilimo Endelevu',

    sustainabilityText:
      'Saidia usimamizi unaowajibika wa shamba kwa kuelewa hali ya udongo na mazingira.',

    food:
      'Uzalishaji wa Chakula',

    foodText:
      'Maamuzi bora ya kilimo yanaweza kusaidia mazao yenye afya na mifumo yenye tija zaidi ya uzalishaji.',

    // =====================================================
    // FEATURES
    // =====================================================
    soilInsights:
      'Taarifa za Udongo',

    soilInsightsDesc:
      'Elewa virutubisho, pH na hali ya mazingira ya udongo.',

    weatherIntelligence:
      'Akili ya Hali ya Hewa',

    weatherIntelligenceDesc:
      'Fuatilia taarifa za hali ya hewa kwa ajili ya kupanga shughuli za shamba.',

    cropRecommendations:
      'Mapendekezo ya Mazao',

    cropRecommendationsDesc:
      'Tambua mazao yanayofaa kulingana na hali ya shamba lako.',

    aiGuidance:
      'Mwongozo wa Kilimo kwa AI',

    aiGuidanceDesc:
      'Pata mwongozo wa kilimo kupitia Mshauri wa AgriSense AI.',

    sensorIntegration:
      'Muunganisho wa Sensors',

    sensorIntegrationDesc:
      'Unganisha sensors za shamba na kufuatilia hali muhimu za mazingira.',

    // =====================================================
    // FARMING
    // =====================================================
    maize:
      'Mahindi',

    rice:
      'Mpunga',

    beans:
      'Maharagwe',

    tomato:
      'Nyanya',

    onion:
      'Kitunguu',

    carrot:
      'Karoti',

    cassava:
      'Muhogo',

    pepper:
      'Pilipili',

    ginger:
      'Tangawizi',

    cabbage:
      'Kabichi',

    pumpkin:
      'Maboga',

    eggplant:
      'Biringanya',

    // =====================================================
    // COMMON MESSAGES
    // =====================================================
    required:
      'Sehemu hii inahitajika.',

    invalidEmail:
      'Tafadhali ingiza barua pepe sahihi.',

    somethingWentWrong:
      'Kuna tatizo limetokea. Tafadhali jaribu tena.',

    noData:
      'Hakuna taarifa zinazopatikana.',

    connectionError:
      'Imeshindikana kuunganishwa na huduma. Tafadhali jaribu tena.',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () =>
      localStorage.getItem('agrisense-lang') || 'EN'
  )

  useEffect(() => {
    localStorage.setItem(
      'agrisense-lang',
      lang
    )

    document.documentElement.lang =
      lang === 'SW' ? 'sw' : 'en'
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,

      t: (key) =>
        translations[lang]?.[key] ??
        translations.EN[key] ??
        key,
    }),
    [lang]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export default translations