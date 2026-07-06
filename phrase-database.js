// ===============================================
// 慶豐蘭業 - 喪禮卡片用詞資料庫 v2
// ===============================================
// 卡片格式：上款 + 中款(輓詞) + 下款
// ===============================================

const funeralPhraseDB = {

    // ===== 卡片格式範本（依宗教區分）=====
    cardFormat: {
        // 一般 / 佛道教
        general: {
            male: {
                senior: '敬悼 {姓}公{名} 老先生 千古',     // 80歲以上或祖父輩
                adult: '敬悼 {姓}{名} 先生 千古'           // 一般
            },
            female: {
                senior: '敬悼 {夫姓}媽{本姓} 老夫人 靈右',  // 長輩已婚
                seniorSingle: '敬悼 {姓}{名} 老夫人 靈右',      // 長輩未婚或不冠夫姓
                adult: '敬悼 {姓}{名} 女士 靈右'                // 一般
            },
            footer: '{送禮人} 敬輓',
            endings: ['千古', '仙逝', '往生蓮邦', '往生淨土']
        },
        // 基督教（新教）- 絕不可用「千古」
        christian: {
            male: {
                baptized: '故 {姓}{名} 弟兄 安息主懷',     // 受洗者
                general: '故 {姓}{名} 先生 安息主懷'       // 未受洗
            },
            female: {
                baptized: '故 {姓}{名} 姊妹 安息主懷',     // 受洗者
                general: '故 {姓}{名} 女士 安息主懷'       // 未受洗
            },
            footer: '{送禮人} 敬輓',
            endings: ['安息主懷', '榮歸天家', '榮歸天國']
        },
        // 天主教
        catholic: {
            male: {
                baptized: '故 {姓}{名} 弟兄 蒙主恩召',     // 受洗者（可加聖名）
                general: '故 {姓}{名} 先生 蒙主恩召'
            },
            female: {
                baptized: '故 {姓}{名} 姊妹 蒙主恩召',
                general: '故 {姓}{名} 女士 蒙主恩召'
            },
            footer: '{送禮人} 敬輓',
            endings: ['蒙主恩召', '魂歸天國']
        }
    },

    // ===== 男喪輓詞（依年齡）=====
    male: {
        // 49歲以下
        under49: [
            '星隕少微', '玉樹長埋', '壯志未酬', '天不假年', '修文赴召',
            '少微星隕', '英年仙去', '英年玉折', '長才未盡', '同體大悲',
            '棟折梁摧', '同悲不捨', '音容宛在', '悵望音容', '英氣頓杳',
            '英風宛在', '英才天妒', '千秋永別', '一別千古', '典則空留', '痛隔天人'
        ],
        // 50-69歲
        age50to69: [
            '星隕少微', '玉樹長埋', '壯志未酬', '天不假年', '修文赴召',
            '少微星隕', '英年仙去', '英年玉折', '長才未盡', '同體大悲',
            '棟折梁摧', '同悲不捨', '音容宛在', '悵望音容', '英氣頓杳',
            '英風宛在', '英才天妒', '千秋永別', '一別千古', '典則空留', '痛隔天人'
        ],
        // 70-79歲
        age70to79: [
            '遽返道山', '儀型足式', '碩德堪欽', '悵望音容', '道範長存',
            '北斗星沉', '返璞歸真', '德業長昭', '駕鶴西歸', '典型宛在',
            '千秋永訣', '海宇風淒', '泰山其頹', '仙凡路隔', '行誼可師',
            '高風亮節', '英風宛在', '高風安仰', '音容如在', '庚星匿彩', '英氣長存'
        ],
        // 80歲以上
        age80plus: [
            '閬苑歸真', '庚星匿彩', '北斗星沉', '蓬島歸真', '羽化登仙',
            '千秋足式', '典則空留', '歸真返璞', '高風亮節', '儀型萬方',
            '桑梓流光', '德範永存', '德望永昭', '道範長存', '斗山安仰',
            '典型足式', '南極星沉', '高山仰止', '碩德貽徽', '儀型足式', '高風安仰'
        ]
    },

    // ===== 女喪輓詞（依年齡）=====
    female: {
        // 49歲以下
        under49: [
            '妝台月冷', '涼月淒清', '塵掩妝台', '悵望音容', '魂兮歸來',
            '遽促芳齡', '音容如在', '音容宛在', '幽明永隔', '望斷白雲',
            '銜哀永逝', '閭里銜哀', '音容隔世', '抱恨終天', '花落萱幃',
            '徽音頓渺', '千秋永訣', '悲興風木'
        ],
        // 50-69歲
        age50to69: [
            '妝台月冷', '涼月淒清', '塵掩妝台', '悵望音容', '魂兮歸來',
            '塵榻空留', '同體大悲', '萱萎北堂', '天不假年', '曇花萎謝',
            '遽促芳齡', '繡幃香冷', '玉簫聲斷', '忘憂草謝', '音容如在',
            '鵑聲月寒', '同悲不捨', '慈雲缥緲', '持家有則', '坤儀足式'
        ],
        // 70-79歲
        age70to79: [
            '瑤池赴召', '北堂春去', '彤管揚芬', '寶婺星沉', '慈雲缥緲',
            '親恩永懷', '懿德長昭', '範垂巾幗', '彤管流芳', '流芳千古',
            '坤儀足式', '閫範長存', '懿範猶存', '悲興風木', '名標彤史',
            '淑德永昭', '母儀千古', '母儀足式', '溫恭淑慎', '慈暉永懷',
            '孟母風高', '賢同歐母'
        ],
        // 80歲以上
        age80plus: [
            '萱儀足式', '萱範長存', '懿德長昭', '彤管流芳', '溫恭淑慎',
            '淑德永昭', '母儀千古', '母儀足式', '萱萎北堂', '懿範垂型',
            '五福全歸', '坤儀宛在', '母儀永懷', '永懷親恩', '慈暉長照', '慈暉永懷'
        ]
    },

    // ===== 宗教輓詞 =====
    religion: {
        // 佛教
        buddhist: [
            '高登蓮品', '上品上生', '功德圓滿', '澤在人間', '悲願宏深',
            '乘願再來', '花開見佛', '淨土可期', '往生蓮邦', '往生極樂',
            '超生極樂', '神超淨域', '九品蓮登', '往生西方', '接引西方',
            '圓超五濁', '俯謝娑婆', '神遊極樂', '神歸極樂', '神歸安養',
            '神歸淨土', '神歸樂國', '神歸淨域', '往生樂土', '土歸寂光',
            '果證菩提', '生西現瑞', '念佛往生', '欣登彼岸', '往生彼岸',
            '蛻然西歸', '往生淨土', '往生佛國', '華開見佛', '化生蓮邦',
            '佛果圓成', '見佛證果', '果證無生', '悟證無生', '非去非來',
            '復來度蒙', '倒駕慈航', '入聖超凡', '安詳捨報', '華開蓮剎',
            '彌陀接引', '法燈隱耀', '法燈乍晦', '慧燈遽晦', '成菩提道',
            '菩提果圓', '菩提圓成', '佛道圓成', '蓮池證果', '慧炬長明',
            '炬光永曜', '位登上品', '駕返蓮邦', '彌陀笑迎', '蓮開寶沼',
            '歸西證果', '西歸蓮域', '遠塵離垢', '覺行圓滿', '蓮沼映輝',
            '蓮邦永托', '念佛生西', '慈光常住', '返真蓮域', '親近諸佛',
            '天樂鳴空', '護國弘教', '慧光溥昭', '宏教垂範'
        ],

        // 一貫道
        yiguandao: [
            '回歸理天', '靈歸無極', '返樸歸真', '駕返瑤池',
            '圓覺歸真', '駕返理天', '認理歸真', '功圓果滿'
        ],

        // 天帝教
        tiandijiao: [
            '功果圓滿', '天帝寵召', '昇天歸位', '回歸自然'
        ],

        // 基督教
        christian: [
            '主懷安息', '在主懷抱', '天國永生', '安息主懷', '息勞歸主',
            '榮歸天國', '永光照之', '永遠懷念', '睡主懷中', '耶穌是主',
            '與主偕行', '與主永偕', '蒙主恩加', '釋勞歸主', '蒙主寵召',
            '永息主懷', '魂登天國', '榮返天鄉', '駕返帝鄉', '永在主前',
            '主懷長生', '永在天國'
        ],

        // 天主教
        catholic: [
            '魂歸天國', '蒙主寵召', '永遠懷念', '榮歸天家', '安然見主'
        ],

        // 一般/無特別信仰
        general: [
            '音容宛在', '典範長存', '駕鶴西歸', '德範永存', '永懷不忘'
        ]
    },

    // ===== 職業專用輓詞 =====
    profession: {
        // 議員/從政
        politician: [
            '邦國精華', '甘棠遺愛', '國失賢良', '耆德元勛', '峴首留碑',
            '勛猷共仰', '忠勤足式', '才厄經綸', '遺愛人間', '萬姓謳思'
        ],

        // 教師/師長
        teacher: [
            '馬帳安仰', '風冷杏壇', '桃李興悲', '立雪神傷', '高山安仰',
            '教澤長存', '教澤永懷', '師表千古', '師表常尊', '永念師恩'
        ],

        // 學者
        scholar: [
            '大雅云亡', '天喪斯文', '立言不朽', '絕學千秋', '學究天人',
            '世失英才', '少微斂曜', '言行足式', '文壇失仰', '文曲光沉', '望尊泰斗'
        ]
    },

    // ===== 通用友人輓詞 =====
    friend: [
        '痛失知音', '話冷雞窗', '心傷畏友', '響絕牙琴', '人琴俱亡',
        '伊人宛在', '範垂巾幗', '福壽全歸', '彤管流芳', '丹管流芬',
        '女界典型', '流芳千古', '涼月淒清', '蓼莪詩廢', '鸞軿遽返',
        '鸞馭遐升', '閨閫之師', '坤儀足式', '坤儀宛在', '閫範空存',
        '閫範長存', '空仰慈顏', '海宗風淒', '花落萱幃', '徽音頓渺',
        '徽音遠播', '魂兮歸來', '巾幗稱賢', '巾幗儀型', '千秋永訣'
    ]
};


// ===============================================
// 喜慶成語資料庫
// ===============================================
const celebrationPhraseDB = {

    // ===== 開幕 =====
    opening: {
        general: [
            '開幕誌慶', '駿業宏開', '鴻圖大展', '生意興隆', '財源廣進',
            '日進斗金', '開張大吉', '萬商雲集', '近悅遠來', '業紹陶朱'
        ],
        restaurant: [
            '賓客盈門', '高朋滿座', '珍饈滿座', '門庭若市', '佳餚滿堂'
        ],
        medical: [
            '杏林春暖', '仁心仁術', '懸壺濟世', '華佗再世', '妙手回春',
            '功同良相', '濟世利民', '德術雙馨'
        ],
        legal: [
            '伸張正義', '法理精湛', '明鏡高懸', '公正廉明', '匡扶正義'
        ]
    },

    // ===== 喬遷 =====
    moving: {
        general: [
            '喬遷之喜', '華廈生輝', '德門仁第', '福地洞天', '竹苞松茂',
            '瑞氣盈門', '門庭集慶', '美輪美奐', '堂構更新'
        ],
        elderly: [
            '福壽康寧', '安居樂業', '福澤綿延'
        ]
    },

    // ===== 升官/當選 =====
    promotion: {
        general: [
            '步步高升', '榮任新職', '鵬程萬里', '高升志喜', '大展鴻圖',
            '飛黃騰達', '榮陞卓越', '仕途順遂'
        ],
        election: [
            '眾望所歸', '造福桑梓', '民主之光', '德孚眾望', '高票當選',
            '眾望攸歸', '為民喉舌', '澤被蒼生'
        ]
    },

    // ===== 展覽 =====
    exhibition: {
        general: [
            '藝壇生輝', '璀璨奪目', '妙筆生花', '化腐朽為神奇',
            '藝苑增輝', '妙造自然', '匠心獨運'
        ]
    },

    // ===== 結婚 =====
    wedding: {
        general: [
            '百年好合', '永浴愛河', '佳偶天成', '琴瑟和鳴',
            '鸞鳳和鳴', '天作之合', '珠聯璧合', '龍鳳呈祥'
        ]
    },

    // ===== 生日/壽宴 =====
    birthday: {
        general: [
            '生日快樂', '心想事成', '萬事如意'
        ],
        elderly: [
            '福如東海', '壽比南山', '松柏長青', '鶴壽松齡',
            '福壽康寧', '南極星輝', '德高壽永', '松鶴延年'
        ],
        longevity: [
            '福壽雙全', '壽翁晉五', '長命百歲', '耄耋康健'
        ]
    },

    // ===== 神明聖誕/廟宇 =====
    temple: {
        general: [
            '神威顯赫', '香火鼎盛', '澤被蒼生', '庇佑蒼生',
            '神恩浩蕩', '聖德長昭', '威靈顯赫', '德澤廣被'
        ],
        mazu: [
            '天后聖母', '海國長安', '航海明燈'
        ],
        guandi: [
            '義薄雲天', '忠義千秋', '浩然正氣'
        ]
    },

    // ===== 春節送禮 =====
    newyear: {
        general: [
            '恭賀新禧', '新年快樂', '萬事如意', '心想事成', '大吉大利',
            '吉祥如意', '財源廣進', '招財進寶', '金玉滿堂', '福星高照',
            '迎春納福', '春到福到', '龍馬精神', '蛇年行大運', '富貴吉祥'
        ],
        business: [
            '生意興隆', '日進斗金', '財源滾滾', '鴻圖大展', '事業蒸蒸日上'
        ],
        family: [
            '闔家平安', '闔家歡樂', '天倫之樂', '福壽雙全', '百福齊臻'
        ]
    },

    // ===== 畢業升學 =====
    graduation: {
        general: [
            '畢業快樂', '學業有成', '前程似錦', '鵬程萬里', '一帆風順',
            '展翅高飛', '百尺竿頭', '更進一步', '學海無涯', '青雲直上'
        ],
        admission: [
            '金榜題名', '魚躍龍門', '蟾宮折桂', '及第登科', '龍門高跳'
        ],
        doctorate: [
            '學富五車', '博學多才', '學術精深', '卓越成就'
        ]
    }
};


// ===== 喜慶成語推薦函數 =====
function getCelebrationPhrases(options) {
    const {
        category,    // 'opening', 'moving', 'promotion', 'exhibition', 'wedding', 'birthday', 'temple', 'newyear', 'graduation'
        subCategory, // 'restaurant', 'medical', 'legal', 'election', 'elderly', 'longevity', 'mazu', 'guandi', 'business', 'family', 'admission', 'doctorate'
        isElderly    // boolean
    } = options;

    const db = celebrationPhraseDB[category];
    if (!db) return [];

    let results = [];

    // 1. 加入通用成語
    if (db.general) {
        results.push(...db.general);
    }

    // 2. 加入子分類
    if (subCategory && db[subCategory]) {
        results.push(...db[subCategory]);
    }

    // 3. 如果是長輩，加入長輩專用
    if (isElderly && db.elderly) {
        results.push(...db.elderly);
    }

    return results;
}



// ===== 智慧推薦函數 =====
function getFuneralPhrases(options) {
    const {
        gender,    // 'male' | 'female'
        age,       // number
        religion   // 'buddhist' | 'yiguandao' | 'tiandijiao' | 'christian' | 'catholic' | 'general'
    } = options;

    // ===== Bug 1 修正：年齡參數驗證 =====
    // age 未填、空字串、NaN、超出合理範圍時，拒絕猜測，直接擋下。
    // 原因：undefined < 50 在 JS 是 false，會一路滑進 age80plus，
    //       對中年往生者印出高壽用語是會被家屬指責的等級錯誤。
    const numAge = Number(age);
    if (!Number.isFinite(numAge) || numAge < 0 || numAge > 120) {
        console.warn('[getFuneralPhrases] ⚠️ 年齡無效或未填:', age,
            '——拒絕猜測，回傳空陣列。請確認前端已驗證年齡欄位。');
        return [];
    }

    let results = [];
    const safeGender = (gender === 'male' || gender === 'female') ? gender : 'male';

    // 1. 依性別和年齡取得基本輓詞
    const genderDB = funeralPhraseDB[safeGender];
    if (genderDB) {
        if (numAge < 50) {
            results.push(...genderDB.under49);
        } else if (numAge < 70) {
            results.push(...genderDB.age50to69);
        } else if (numAge < 80) {
            results.push(...genderDB.age70to79);
        } else {
            results.push(...genderDB.age80plus);
        }
    }

    // 2. 加入宗教輓詞
    if (religion && funeralPhraseDB.religion[religion]) {
        results.push(...funeralPhraseDB.religion[religion]);
    }

    // 去重複
    results = [...new Set(results)];

    // 3. 交集過濾 (剔除不合適的詞彙)
    const daoistBuddhistBlacklist = [
        '駕鶴西歸', '羽化登仙', '蓬島歸真', '仙凡路隔', '返璞歸真', '歸真返璞', 
        '瑤池赴召', '寶婺星沉', '高登蓮品', '上品上生', '功德圓滿', '澤在人間', 
        '悲願宏深', '淨土可期', '往生蓮邦', '超生極樂', '神超淨域', '往生西方', 
        '接引西方', '圓超五濁', '俯謝娑婆', '神遊極樂', '神歸極樂', '神歸安養', 
        '神歸淨土', '神歸樂國', '神歸淨域', '往生樂土', '土歸寂光', '果證菩提', 
        '生西現瑞', '念佛往生', '欣登彼岸', '往生彼岸', '蛻然西歸', '往生佛國', 
        '華開見佛', '化生蓮邦', '佛果圓成', '見佛證果', '果證無生', '悟證無生', 
        '非去非來', '復來度蒙', '倒駕慈航', '入聖超凡', '安詳捨報', '華開蓮剎', 
        '彌陀接引', '法燈隱耀', '法燈乍晦', '慧燈遽晦', '成菩提道', '菩提果圓', 
        '菩提圓成', '佛道圓成', '蓮池證果', '慧炬長明', '炬光永曜', '位登上品', 
        '駕返蓮邦', '彌陀笑迎', '蓮開寶沼', '歸西證果', '西歸蓮域', '遠塵離垢', 
        '覺行圓滿', '蓮沼映輝', '蓮邦永托', '念佛生西', '慈光常住', '返真蓮域', 
        '親近諸佛', '天樂鳴空', '護國弘教', '慧光溥昭', '宏教垂範', '回歸理天', 
        '靈歸無極', '駕返瑤池', '圓覺歸真', '駕返理天', '認理歸真', '功圓果滿',
        '九品蓮登', '乘願再來', '往生極樂'
    ];

    results = results.filter(phrase => {
        // 如果是基督教或天主教，剔除佛道教專屬詞彙及「千古」
        if (religion === 'christian' || religion === 'catholic') {
            if (daoistBuddhistBlacklist.includes(phrase)) return false;
            if (phrase.includes('千古')) return false;
        }
        
        // 年齡過濾：宗教詞彙若有明顯高壽意象，避免年輕人用到
        const isHighAgePhrase = ['福壽全歸', '五福全歸', '功果圓滿', '功圓果滿'];
        if (numAge < 70 && isHighAgePhrase.includes(phrase)) return false;

        return true;
    });

    return results;
}


// ===== 產生卡片格式（依宗教）=====
function generateCardFormat(options) {
    const {
        gender,      // 'male' | 'female'
        age,         // number
        lastName,    // 姓
        firstName,   // 名
        husbandName, // 夫姓 (女性已婚用)
        isMarried,   // 是否已婚 (女性用)
        useHusbandSurname = true, // 是否冠夫姓
        isSenior = age >= 80, // 是否高壽 (改由外部傳入或依賴年齡)
        isBaptized,  // 是否受洗 (基督教/天主教用)
        religion,    // 'general' | 'christian' | 'catholic'
        senderName,  // 送禮人
        phrase,      // 選擇的輓詞
        relation     // 關係
    } = options;

    let topLine = '';
    const safeGender = (gender === 'male' || gender === 'female') ? gender : 'male'; // 防止未填性別導致崩潰

    // 決定宗教格式
    const religionKey = (religion === 'christian' || religion === 'catholic') ? religion : 'general';
    const format = funeralPhraseDB.cardFormat[religionKey];

    if (religionKey === 'general') {
        // 一般/佛道教格式
        if (safeGender === 'male') {
            const template = isSenior ? format.male.senior : format.male.adult;
            topLine = template
                .replace('{姓}', lastName)
                .replace('{名}', firstName);
        } else {
            if (isSenior) {
                if (isMarried && useHusbandSurname) {
                    topLine = format.female.senior
                        .replace('{夫姓}', husbandName || '')
                        .replace('{本姓}', lastName)
                        .replace('{名}', firstName);
                } else {
                    topLine = (format.female.seniorSingle || '敬悼 {姓}{名} 老夫人 靈右')
                        .replace('{姓}', lastName)
                        .replace('{名}', firstName);
                }
            } else {
                topLine = format.female.adult
                    .replace('{姓}', lastName)
                    .replace('{名}', firstName);
            }
        }
    } else {
        // 基督教/天主教格式
        const subType = isBaptized ? 'baptized' : 'general';
        const template = format[safeGender][subType];
        topLine = template
            .replace('{姓}', lastName)
            .replace('{名}', firstName);
    }

    // 決定下款（敬輓/泣輓）
    let footerSuffix = '敬輓';
    if (relation === 'parents' || relation === 'grandparents' || relation === 'siblings' || relation === 'spouse') {
        footerSuffix = '泣輓';
    }

    // 回傳下款選項
    const footerOptions = ['敬輓', '泣輓', '拜輓'];
    if (religionKey !== 'general') {
        footerOptions.push('In Memory');
    }

    // ===== Bug 2 修正：加入 internalId =====
    // 同一場喪禮若有同名同姓（如兩位「陳媽林老夫人」），
    // 操作員在後台無法區分。加上內部識別碼供核對用，不會印在卡片上。
    const internalId = [
        (lastName || ''),
        (firstName || ''),
        safeGender === 'male' ? 'M' : 'F',
        age || '?',
        religionKey,
        Date.now().toString(36).slice(-4) // 短時間戳避免完全相同
    ].join('-');

    return {
        topLine: topLine,
        middleLine: phrase,
        bottomLine: `${senderName} ${footerSuffix}`,
        validEndings: format.endings,  // 結尾 (千古/安息主懷)
        footerOptions: footerOptions,  // 下款選項
        internalId: internalId         // 內部核對用，不顯示在卡片上
    };
}


// ===== 取得適用的結尾用詞 =====
function getValidEndings(religion) {
    const religionKey = (religion === 'christian' || religion === 'catholic') ? religion : 'general';
    return funeralPhraseDB.cardFormat[religionKey].endings;
}


// 匯出
if (typeof module !== 'undefined') {
    module.exports = { funeralPhraseDB, getFuneralPhrases, generateCardFormat, getValidEndings };
}


