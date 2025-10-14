import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    // Header
    'header.home': 'الرئيسية',
    'header.services': 'خدماتنا',
    'header.products': 'منتجاتنا',
    'header.about': 'من نحن',
    'header.projects': 'مشاريعنا',
    'header.contact': 'تواصل معنا',
    'header.consultation': 'احصل على استشارة',
    'header.consultShort': 'استشارة',
    'header.search': 'ابحث عن المنتجات...',
    
    // Services in Header
    'services.indoorLighting': 'إضاءة داخلية',
    'services.outdoorLighting': 'إضاءة خارجية', 
    'services.decorativeLighting': 'إضاءة ديكور',
    
    // Hero
    'hero.title': ' الحلول الكهربائية والإلكترونية والإضاءة المتطورة',
    'hero.subtitle': 'نحن في ELEX نقدم أحدث التقنيات في مجالات الكهرباء والإلكترونيات والإضاءة، مع التزامنا بالجودة والابتكار لتقديم خدمات متكاملة لعملائنا.',
    'hero.exploreServices': 'استكشف خدماتنا',
    'hero.contactUs': 'تواصل معنا',
    'hero.lightingSolutions': 'حلول الإضاءة',
    'hero.lightingDesc': 'أنظمة إضاءة حديثة وموفرة للطاقة',
    'hero.energySolutions': 'الحلول الكهربائية',
    'hero.energyDesc': 'أنظمة متكاملة تحقق الكفاءة والاستدامة.',
    'hero.technicalServices': 'الخدمات التقنية',
    'hero.technicalDesc': 'دعم فني متخصص وصيانة شاملة',
    
    // Services
    'services.title': 'خدماتنا المتخصصة',
    'services.subtitle': 'نقدم مجموعة شاملة من الخدمات في مجالات الكهرباء والإلكترونيات والإضاءة والتكييف',
    'services.learnMore': 'اعرف المزيد',
    'services.loading': 'جاري تحميل الخدمات...',
    'services.none': 'لا توجد خدمات متاحة حالياً',
    'services.whatsapp': 'تواصل واتساب',
    'services.lightingDesign': 'تصميم الإضاءة (DIALux)',
    'services.lightingDesignDesc': 'حلول إضاءة متطورة ومخصصة باستخدام برنامج DIALux المتقدم للتصميم الضوئي',
    'services.electricalWorks': 'الأعمال الكهربائية (AutoCAD)',
    'services.electricalWorksDesc': 'حلول كهربائية متكاملة تشمل المخططات التنفيذية ولوحات التوزيع والكابلات',
    'services.smartControl': 'التحكم الذكي (KNX, DALI, BMS)',
    'services.smartControlDesc': 'أنظمة التحكم الذكي المتطورة لإدارة الإضاءة والتكييف والمباني الذكية',
    'services.airConditioning': 'أنظمة التكييف',
    'services.airConditioningDesc': 'تصميم وتركيب وصيانة أنظمة التكييف والتهوية بكفاءة عالية.',
    
    // Service Features
    'services.executivePlans': 'مخططات تنفيذية',
    'services.distributionPanels': 'لوحات توزيع',
    'services.cablesCircuits': 'كابلات وقواطع كهربائية',
    'services.lightingControl': 'ربط الإضاءة',
    'services.acControl': 'التحكم في التكييف',
    'services.smartBuilding': 'إدارة المبنى الذكي',
    'services.centralAC': 'تكييف مركزي',
    'services.splitUnits': 'وحدات منفصلة',
    'services.maintenance': 'صيانة شاملة',
    
    // About
    'about.title': 'من نحن',
    'about.subtitle': 'مؤسسة عبدالله جمال عبدالرحمن الزامل للتجارة',
    
    // Footer
    'footer.description': 'نحن في ELEX نقدم حلول مبتكرة في مجال الطاقة والإضاءة مع التزامنا بأعلى معايير الجودة والخدمة',
    
    // Product Showcase
    'product.featuredBadge': 'منتج مميز',
    'product.modernLED': 'أضواء LED الحديثة',
    'product.ledDescription': 'اكتشف مجموعتنا المميزة من أضواء LED عالية الكفاءة والتوفير في الطاقة',
    'product.advancedCeiling': 'إضاءة LED سقفية متطورة',
    'product.productDescription': 'تصميم عصري وأنيق مع تقنية LED المتقدمة لإضاءة مثالية وتوفير استثنائي في الطاقة. مناسبة للمنازل والمكاتب والمشاريع التجارية.',
    'product.energySaving': 'توفير في الطاقة',
    'product.energySavingDesc': 'حتى 80% توفير في استهلاك الكهرباء',
    'product.longWarranty': 'ضمان طويل',
    'product.longWarrantyDesc': 'ضمان لمدة 5 سنوات على جميع المنتجات',
    'product.highQuality': 'جودة عالية',
    'product.highQualityDesc': 'مواد عالية الجودة ومعايير دولية',
    'product.currency': 'ريال',
    'product.discount': 'وفر 100 ريال - عرض محدود!',
    'product.orderNow': 'اطلب الآن',
    'product.moreDetails': 'تفاصيل أكثر',
    
    // Products page
    'products.featuredTitle': 'منتجاتنا المميزة',
    'products.subtitle': 'مجموعة متنوعة من المنتجات عالية الجودة في مجال الطاقة والإضاءة',
    'products.searchResultsPrefix': 'نتائج البحث عن:',
    'products.foundPrefix': 'تم العثور على',
    'products.itemsSuffix': 'منتج',
    'products.loading': 'جاري تحميل المنتجات...',
    'products.badgeFeatured': 'مميز',
    'products.noneFound': 'لم يتم العثور على منتجات',
    'products.noMatchPrefix': 'لا توجد منتجات تطابق البحث عن',
    'products.clearSearch': 'مسح البحث',
    'products.none': 'لا توجد منتجات متاحة حالياً',

    // Service detail
    'service.loading': 'جاري تحميل تفاصيل الخدمة...',
    'service.notFound': 'الخدمة غير موجودة',
    'service.backHome': 'العودة للرئيسية',
    'service.backToServices': 'العودة للخدمات',
    'service.detailsTitle': 'تفاصيل الخدمة',
    'service.noDetails': 'لا توجد تفاصيل متاحة حالياً لهذه الخدمة.',
    'service.specialization': 'التخصص',
    'service.needThis': 'هل تحتاج هذه الخدمة؟',
    'service.ctaSubtitle': 'تواصل معنا للحصول على استشارة مجانية وعرض سعر مخصص',
    'service.callNow': 'اتصل بنا',
    'service.emailUs': 'راسلنا عبر الإيميل',
    'service.whatsapp': 'تواصل عبر الواتساب',
    
    // About
    'about.aboutBadge': 'من نحن',
    'about.leadersTitle': 'رواد في الحلول الكهربائية والإلكترونية والإضاءة',
    'about.companyDescription': 'شركة ELEX متخصصة في الحلول الكهربائية والإلكترونية ، تجمع بين الابتكار والتقنيات الحديثة لتقديم تجربة متكاملة بمعايير عالمية ,نفخر بخبرتنا وفريقنا المتخصص القادر على تنفيذ المشاريع بدقة وكفاءة، لتلبية متطلبات السوق السعودي والقطاعات المختلفة.',
    'about.yearsExperience': 'سنوات خبرة',
    'about.satisfiedClients': 'عميل راضٍ',
    'about.completedProjects': 'مشروع منجز',
    'about.innovativeSolutions': 'حل مبتكر',
    'about.ourVision': 'رؤيتنا',
    'about.visionDescription': 'أن نكون الشركة الرائدة في مجال الحلول الكهربائية والإلكترونية والإضاءة في المملكة العربية السعودية، وأن نساهم في تحقيق رؤية 2030 من خلال تقديم حلول مبتكرة ومستدامة.',
    'about.ourMission': 'مهمتنا',
    'about.missionDescription': 'تقديم حلول متكاملة ومبتكرة في مجالات الكهرباء والإلكترونيات والإضاءة ، بأعلى معايير الجودة والكفاءة لخدمة الجهات الحكومية والخاصة والأفراد.',
    'about.coreValues': 'قيمنا الأساسية',
    'about.valuesDescription': 'نؤمن بالقيم التي تشكل أساس عملنا وتوجه خطواتنا نحو التميز',
    'about.qualityExcellence': 'الجودة والتميز',
    'about.qualityDesc': 'نلتزم بأعلى معايير الجودة في جميع خدماتنا ومشاريعنا',
    'about.technicalInnovation': 'الابتكار التقني',
    'about.innovationDesc': 'نواكب أحدث التطورات التقنية لتقديم حلول متقدمة',
    'about.customerSatisfaction': 'رضا العملاء',
    'about.satisfactionDesc': 'نضع رضا عملائنا في المقدمة ونسعى لتجاوز توقعاتهم',
    'about.environmentalSustainability': 'الاستدامة البيئية',
    'about.sustainabilityDesc': 'نلتزم بالحلول الصديقة للبيئة والموفرة للطاقة',
    
    // Footer
    'footer.companyName': 'ELEX',
    'footer.companyDescription': 'شركة متخصصة في الحلول الكهربائية والإلكترونية والإضاءة والتكييف والشاشات الرقمية.نلتزم بتقديم حلول مبتكرة ومستدامة تواكب تطلعات السوق، مع ضمان الجودة والتميز في جميع أنحاء المملكة.',
    'footer.ourServices': 'خدماتنا',
    'footer.contactUs': 'تواصل معنا',
    'footer.saudiArabia': 'المملكة العربية السعودية',
    'footer.newsletter': 'اشترك في نشرتنا الإخبارية',
    'footer.newsletterDesc': 'احصل على آخر الأخبار والعروض المميزة',
    'footer.emailPlaceholder': 'بريدك الإلكتروني',
    'footer.subscribe': 'اشتراك',
    'footer.allRightsReserved': '© 2024 ELEX. جميع الحقوق محفوظة.',
    'footer.home': 'الرئيسية',
    'footer.aboutUs': 'من نحن',
    'footer.ourServices2': 'خدماتنا',
    'footer.ourProjects': 'مشاريعنا',
    'footer.contactUs2': 'تواصل معنا',
  },
  en: {
    // Header
    'header.home': 'Home',
    'header.services': 'Our Services',
    'header.products': 'Our Products',
    'header.about': 'About Us',
    'header.projects': 'Our Projects',
    'header.contact': 'Contact Us',
    'header.consultation': 'Get Consultation',
    'header.consultShort': 'Consultation',
    'header.search': 'Search for products...',
    
    // Services in Header
    'services.indoorLighting': 'Indoor Lighting',
    'services.outdoorLighting': 'Outdoor Lighting', 
    'services.decorativeLighting': 'Decorative Lighting',
    
    // Hero
    'hero.title': 'Electrical, Electronic Products and Advanced Lighting Solutions',
    'hero.subtitle': 'At ELEX, we provide the latest technologies in energy and lighting with our commitment to quality and innovation to serve our customers',
    'hero.exploreServices': 'Explore Our Services',
    'hero.contactUs': 'Contact Us',
    'hero.lightingSolutions': 'Lighting Solutions',
    'hero.lightingDesc': 'Advanced and energy-efficient lighting systems',
    'hero.energySolutions': 'Energy Solutions',
    'hero.energyDesc': 'Sustainable and renewable energy solutions',
    'hero.technicalServices': 'Technical Services',
    'hero.technicalDesc': 'Specialized technical support and comprehensive maintenance',
    
    // Services
    'services.title': 'Our Specialized Services',
    'services.subtitle': 'We provide a comprehensive range of services in energy, lighting, and air conditioning',
    'services.learnMore': 'Learn More',
    'services.loading': 'Loading services...',
    'services.none': 'No services available currently',
    'services.whatsapp': 'WhatsApp',
    'services.lightingDesign': 'Lighting Design (DIALux)',
    'services.lightingDesignDesc': 'Advanced and customized lighting solutions using DIALux professional lighting design software',
    'services.electricalWorks': 'Electrical Works (AutoCAD)',
    'services.electricalWorksDesc': 'Comprehensive electrical solutions including executive plans, distribution panels, and electrical cables',
    'services.smartControl': 'Smart Control (KNX, DALI, BMS)',
    'services.smartControlDesc': 'Advanced smart control systems for managing lighting, air conditioning, and smart buildings',
    'services.airConditioning': 'Air Conditioning Systems',
    'services.airConditioningDesc': 'Advanced and energy-efficient air conditioning systems to ensure comfort in all seasons',
    
    // Service Features
    'services.executivePlans': 'Executive Plans',
    'services.distributionPanels': 'Distribution Panels',
    'services.cablesCircuits': 'Cables & Circuit Breakers',
    'services.lightingControl': 'Lighting Control',
    'services.acControl': 'Air Conditioning Control',
    'services.smartBuilding': 'Smart Building Management',
    'services.centralAC': 'Central Air Conditioning',
    'services.splitUnits': 'Split Units',
    'services.maintenance': 'Comprehensive Maintenance',
    
    // About
    'about.title': 'About Us',
    'about.subtitle': 'Abdullah Jamal Abdulrahman Al-Zamel Trading Establishment',
    
    // Footer
    'footer.description': 'At ELEX, we provide innovative solutions in energy and lighting with our commitment to the highest standards of quality and service',
    
    // Product Showcase
    'product.featuredBadge': 'Featured Product',
    'product.modernLED': 'Modern LED Lights',
    'product.ledDescription': 'Discover our premium collection of high-efficiency, energy-saving LED lights',
    'product.advancedCeiling': 'Advanced LED Ceiling Light',
    'product.productDescription': 'Modern and elegant design with advanced LED technology for optimal lighting and exceptional energy savings. Suitable for homes, offices, and commercial projects.',
    'product.energySaving': 'Energy Saving',
    'product.energySavingDesc': 'Up to 80% savings in electricity consumption',
    'product.longWarranty': 'Long Warranty',
    'product.longWarrantyDesc': '5-year warranty on all products',
    'product.highQuality': 'High Quality',
    'product.highQualityDesc': 'High-quality materials and international standards',
    'product.currency': 'SAR',
    'product.discount': 'Save 100 SAR - Limited offer!',
    'product.orderNow': 'Order Now',
    'product.moreDetails': 'More Details',

    // Products page
    'products.featuredTitle': 'Our Featured Products',
    'products.subtitle': 'A diverse range of high-quality energy and lighting products',
    'products.searchResultsPrefix': 'Search results for:',
    'products.foundPrefix': 'Found',
    'products.itemsSuffix': 'items',
    'products.loading': 'Loading products...',
    'products.badgeFeatured': 'Featured',
    'products.noneFound': 'No products found',
    'products.noMatchPrefix': 'No products match the search for',
    'products.clearSearch': 'Clear search',
    'products.none': 'No products available currently',

    // Service detail
    'service.loading': 'Loading service details...',
    'service.notFound': 'Service not found',
    'service.backHome': 'Back to Home',
    'service.backToServices': 'Back to Services',
    'service.detailsTitle': 'Service Details',
    'service.noDetails': 'No details are currently available for this service.',
    'service.specialization': 'Specialization',
    'service.needThis': 'Do you need this service?',
    'service.ctaSubtitle': 'Contact us for a free consultation and a tailored quote',
    'service.callNow': 'Call us',
    'service.emailUs': 'Email us',
    'service.whatsapp': 'Chat on WhatsApp',
    
    // About
    'about.aboutBadge': 'About Us',
    'about.leadersTitle': 'Leaders in Energy and Lighting',
    'about.companyDescription': 'ELEX company specializes in energy and lighting solutions, electrical services, and technical innovation. We strive to provide the best innovative and sustainable solutions to our customers while maintaining the highest standards of quality and safety. We are proud of our extensive experience and specialized team in providing distinguished services that meet the needs of the Saudi market.',
    'about.yearsExperience': 'Years Experience',
    'about.satisfiedClients': 'Satisfied Clients',
    'about.completedProjects': 'Completed Projects',
    'about.innovativeSolutions': 'Innovative Solutions',
    'about.ourVision': 'Our Vision',
    'about.visionDescription': 'To be the leading company in energy and lighting solutions in the Kingdom of Saudi Arabia, and contribute to achieving Vision 2030 by providing sustainable and innovative solutions',
    'about.ourMission': 'Our Mission',
    'about.missionDescription': 'Providing integrated and innovative solutions in energy, lighting, and electrical services with the highest standards of quality and efficiency to serve government, private, and individual entities',
    'about.coreValues': 'Our Core Values',
    'about.valuesDescription': 'We believe in the values that form the foundation of our work and guide our steps towards excellence',
    'about.qualityExcellence': 'Quality & Excellence',
    'about.qualityDesc': 'We are committed to the highest quality standards in all our services and projects',
    'about.technicalInnovation': 'Technical Innovation',
    'about.innovationDesc': 'We keep up with the latest technical developments to provide advanced solutions',
    'about.customerSatisfaction': 'Customer Satisfaction',
    'about.satisfactionDesc': 'We put our customers satisfaction first and strive to exceed their expectations',
    'about.environmentalSustainability': 'Environmental Sustainability',
    'about.sustainabilityDesc': 'We are committed to eco-friendly and energy-efficient solutions',
    
    // Footer
    'footer.companyName': 'ELEX',
    'footer.companyDescription': 'ELEX company specializes in energy and lighting solutions, electrical services, and technical innovation. We provide the best innovative and sustainable solutions to our customers while ensuring quality and excellence throughout the Kingdom',
    'footer.ourServices': 'Our Services',
    'footer.contactUs': 'Contact Us',
    'footer.saudiArabia': 'Saudi Arabia',
    'footer.newsletter': 'Subscribe to Our Newsletter',
    'footer.newsletterDesc': 'Get the latest news and special offers',
    'footer.emailPlaceholder': 'Your email address',
    'footer.subscribe': 'Subscribe',
    'footer.allRightsReserved': '© 2024 ELEX. All rights reserved.',
    'footer.home': 'Home',
    'footer.aboutUs': 'About Us',
    'footer.ourServices2': 'Our Services',
    'footer.ourProjects': 'Our Projects',
    'footer.contactUs2': 'Contact Us',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    // Update HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Update body class for styling
    document.body.className = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
