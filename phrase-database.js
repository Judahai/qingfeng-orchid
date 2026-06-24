// ===============================================
// 慶豐蘭業 - 喪禮卡片用詞資料庫 v4 (最終確認版)
// ===============================================
// 卡片格式：上款 + 中款(輓詞) + 下款
// ===============================================

const funeralPhraseDB = {

    // ===== 卡片格式範本（依宗教區分）=====
    cardFormat: {
        // 一般 / 佛道教 (結尾採動態生成，不寫死)
        general: {
            male: {
                senior: '敬悼 {姓}公{名} 老先生 {結尾}',    // 70歲以上
                adult:  '敬悼 {姓}{名} 先生 {結尾}'         // 一般
            },
            female: {
                marriedSenior: '敬悼 {夫姓}媽{本姓} 老夫人 {結尾}', // 70歲以上已婚 (不帶名)
                marriedAdult:  '敬悼 {夫姓}媽{本姓} 夫人 {結尾}',   // 69歲以下已婚 (不帶名)
                unmarried:     '敬悼 {姓}{名} 女士 {結尾}'          // 未婚或一般
            },
            endings: {
                maleYoung: '靈前',   // 男 < 50
                maleOld: '千古',     // 男 >= 50
                femaleYoung: '靈右', // 女 < 50
                femaleOld: '仙逝'    // 女 >= 50
            }
        },
        // 基督教（新教）- 絕不可用「千古」
        christian: {
            male: {
                baptized: '故 {姓}{名} 弟兄 安息主懷',     // 受洗者
                general:  '故 {姓}{名} 先生 安息主懷'       // 未受洗
            },
            female: {
                baptized: '故 {姓}{名} 姊妹 安息主懷',     // 受洗者
                general:  '故 {姓}{名} 女士 安息主懷'       // 未受洗
            },
            endings: ['安息主懷', '榮歸天家', '榮歸天國']
        },
        // 天主教
        catholic: {
            male: {
                baptized: '故 {姓}{名} 弟兄 蒙主恩召',     // 受洗者（可加聖名）
                general:  '故 {姓}{名} 先生 蒙主恩召'
            },
            female: {
                baptized: '故 {姓}{名} 姊妹 蒙主恩召',
                general:  '故 {姓}{名} 女士 蒙主恩召'
            },
            endings: ['蒙主恩召', '魂歸天國']
        }
    },

    // ===== 男喪輓詞（依年齡）=====
    male: {
        // 49歲以下 (早逝)
        under49: [
            '星隕少微', '玉樹長埋', '壯志未酬', '天不假年', '修文赴召',
            '少微星隕', '英年仙去', '英年玉折', '長才未盡', '同體大悲',
            '棟折梁摧', '同悲不捨', '音容宛在', '悵望音容', '英氣頓杳',
            '英才天妒', '千秋永別', '一別千古', '典則空留', '痛隔天人'
        ],
        // 50-69歲 (中年/一般) - 已移除早逝專用語
        age50to69: [
            '遽返道山', '儀型足式', '悵望音容', '道範長存', '北斗星沉', 
            '返璞歸真', '德業長昭', '駕鶴西歸', '典型宛在', '千秋永訣', 
            '海宇風淒', '泰山其頹', '仙凡路隔', '行誼可師', '英風宛在', 
            '音容如在', '英氣長存', '大雅云亡', '哲人其萎', '典範長存'
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
        // 50-69歲 (已移除 '遽促芳齡')
        age50to69: [
            '妝台月冷', '涼月淒清', '塵掩妝台', '悵望音容', '魂兮歸來',
            '塵榻空留', '同體大悲', '萱萎北堂', '天不假年', '曇花萎謝',
            '繡幃香冷', '玉簫聲斷', '忘憂草謝', '音容如在', '鵑聲月寒', 
            '同悲不捨', '慈雲缥緲', '持家有則', '坤儀足式'
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
        buddhist: [
            '高登蓮品', '上品上生', '功德圓滿', '澤在人間', '悲願宏深',
            '乘願再來', '花開見佛', '淨土可期', '往生蓮邦', '往生極樂',
            '超生極樂', '神超淨域', '九品蓮登', '往生西方', '接引西方',
            '往生淨土', '往生佛國', '華開見佛', '化生蓮邦', '佛果圓成',
            '果證菩提', '安詳捨報', '念佛往生', '駕返蓮邦', '蓮池證果', '覺行圓滿'
        ],
        yiguandao: [
            '回歸理天', '靈歸無極', '返樸歸真', '駕返瑤池',
            '圓覺歸真', '駕返理天', '認理歸真', '功圓果滿'
        ],
        tiandijiao: [
            '功果圓滿', '天帝寵召', '昇天歸位', '回歸自然'
        ],
        christian: [
            '主懷安息', '在主懷抱', '天國永生', '安息主懷', '息勞歸主',
            '榮歸天國', '永光照之', '永遠懷念', '睡主懷中', '耶穌是主'
        ],
        catholic: [
            '魂歸天國', '蒙主寵召', '永遠懷念', '榮歸天家', '安然見主'
        ],
        general: [
            '音容宛在', '典範長存', '駕鶴西歸', '德範永存', '永懷不忘'
        ]
    },

    // ===== 職業專用輓詞 =====
    profession: {
        teacher: [
            '馬帳安仰', '風冷杏壇', '桃李興悲', '立雪神傷', '高山安仰',
            '教澤長存', '教澤永懷', '師表千古', '師表常尊', '永念師恩'
        ],
        scholar: [
            '大雅云亡', '天喪斯文', '立言不朽', '絕學千秋', '學究天人',
            '世失英才', '少微斂曜', '言行足式', '文壇失仰', '文曲光沉', '望尊泰斗'
        ]
    },

    // ===== 通用友人輓詞 =====
    friend: {
        male: [
            '痛失知音', '話冷雞窗', '心傷畏友', '響絕牙琴', '人琴俱亡', '海宗風淒', '千秋永訣'
        ],
        female: [
            '伊人宛在', '範垂巾幗', '福壽全歸', '彤管流芳', '丹管流芬',
            '女界典型', '流芳千古', '涼月淒清', '蓼莪詩廢', '鸞軿遽返',
            '鸞馭遐升', '閨閫之師', '坤儀足式', '坤儀宛在', '閫範空存',
            '閫範長存', '空仰慈顏', '花落萱幃', '徽音頓渺', '徽音遠播',
            '魂兮歸來', '巾幗稱賢', '巾幗儀型', '千秋永訣'
        ]
    }
};


// ===============================================
// 喜慶成語資料庫
// ===============================================
const celebrationPhraseDB = {
    opening: {
        general: [
            '開幕誌慶', '駿業宏開', '鴻圖大展', '生意興隆', '財源廣進',
            '日進斗金', '開張大吉', '萬商雲集', '近悅遠來', '業紹陶朱'
        ],
        restaurant: ['賓客盈門', '高朋滿座', '珍饈滿座', '門庭若市', '佳餚滿堂'],
        medical: ['杏林春暖', '仁心仁術', '懸壺濟世', '華佗再世', '妙手回春', '功同良相'],
        legal: ['伸張正義', '法理精湛', '明鏡高懸', '公正廉明', '匡扶正義']
    },
    moving: {
        general: ['喬遷之喜', '華廈生輝', '德門仁第', '福地洞天', '竹苞松茂', '美輪美奐'],
        elderly: ['福壽康寧', '安居樂業', '福澤綿延']
    },
    promotion: {
        general: ['步步高升', '榮任新職', '鵬程萬里', '高升志喜', '大展鴻圖'],
        election: ['眾望所歸', '造福桑梓', '民主之光', '德孚眾望', '高票當選']
    },
    exhibition: {
        general: ['藝壇生輝', '璀璨奪目', '妙筆生花', '化腐朽為神奇', '藝苑增輝', '匠心獨運']
    },
    wedding: {
        general: ['百年好合', '永浴愛河', '佳偶天成', '琴瑟和鳴', '鸞鳳和鳴', '天作之合']
    },
    birthday: {
        general: ['生日快樂', '心想事成', '萬事如意'],
        elderly: ['福如東海', '壽比南山', '松柏長青', '鶴壽松齡', '松鶴延年'],
        longevity: ['福壽雙全', '壽翁晉五', '長命百歲', '耄耋康健']
    },
    temple: {
        general: ['神威顯赫', '香火鼎盛', '澤被蒼生', '庇佑蒼生', '神恩浩蕩'],
        mazu: ['天后聖母', '海國長安', '航海明燈'],
        guandi: ['義薄雲天', '忠義千秋', '浩然正氣']
    },
    newyear: {
        general: [
            '恭賀新禧', '新年快樂', '萬事如意', '心想事成', '大吉大利',
            '吉祥如意', '財源廣進', '招財進寶', '金玉滿堂', '福星高照',
            '迎春納福', '春到福到', '龍馬精神', '新春大吉', '富貴吉祥'
        ],
        business: ['生意興隆', '日進斗金', '財源滾滾', '鴻圖大展', '事業蒸蒸日上'],
        family: ['闔家平安', '闔家歡樂', '天倫之樂', '福壽雙全', '百福齊臻']
    },
    graduation: {
        general: ['畢業快樂', '學業有成', '前程似錦', '鵬程萬里', '一帆風順'],
        admission: ['金榜題名', '魚躍龍門', '蟾宮折桂', '及第登科', '龍門高跳'],
        doctorate: ['學富五車', '博學多才', '學術精深', '卓越成就']
    }
};


// ===== 喜慶成語推薦函數 =====
function getCelebrationPhrases(options) {
    const { category, subCategory, isElderly } = options;
    const db = celebrationPhraseDB[category];
    if (!db) return [];

    let results = [];
    if (db.general) results.push(...db.general);
    if (subCategory && db[subCategory]) results.push(...db[subCategory]);
    if (isElderly && db.elderly) results.push(...db.elderly);

    return results;
}

// ===== 智慧推薦函數 =====
function getFuneralPhrases(options) {
    const {
        gender,      // 'male' | 'female'
        age,         // number
        religion,    // 'buddhist' | 'christian' | etc.
        relation,    // 關係 (用來判定是否推薦友人專用語)
        profession   // 'teacher' | 'scholar'
    } = options;

    let results = [];
    const genderDB = funeralPhraseDB[gender];

    // 1. 依性別和年齡取得基本輓詞
    if (genderDB) {
        if (age < 50) {
            results.push(...genderDB.under49);
        } else if (age < 70) {
            results.push(...genderDB.age50to69);
        } else if (age < 80) {
            results.push(...genderDB.age70to79);
        } else {
            results.push(...genderDB.age80plus);
        }
    }

    // 2. 加入朋友/同事專屬輓詞
    if ((relation === 'friend' || relation === 'colleague') && funeralPhraseDB.friend[gender]) {
        results.push(...funeralPhraseDB.friend[gender]);
    }

    // 3. 加入職業專屬輓詞
    if (profession && funeralPhraseDB.profession[profession]) {
        results.push(...funeralPhraseDB.profession[profession]);
    }

    // 4. 加入宗教輓詞
    if (religion && funeralPhraseDB.religion[religion]) {
        results.push(...funeralPhraseDB.religion[religion]);
    }

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
        isBaptized,  // 是否受洗 (基督教/天主教用)
        religion,    // 'general' | 'christian' | 'catholic'
        senderName,  // 送禮人
        phrase,      // 選擇的輓詞
        relation     // 關係
    } = options;

    let topLine = '';
    const isSenior = age >= 70; 
    const isYoung = age < 50;

    const religionKey = (religion === 'christian' || religion === 'catholic') ? religion : 'general';
    const format = funeralPhraseDB.cardFormat[religionKey];

    if (religionKey === 'general') {
        // 決定結尾 (靈前/千古/靈右/仙逝)
        let ending = '';
        if (gender === 'male') {
            ending = isYoung ? format.endings.maleYoung : format.endings.maleOld;
            const template = isSenior ? format.male.senior : format.male.adult;
            topLine = template
                .replace('{姓}', lastName)
                .replace('{名}', firstName)
                .replace('{結尾}', ending);
        } else {
            ending = isYoung ? format.endings.femaleYoung : format.endings.femaleOld;
            if (isMarried) {
                const template = isSenior ? format.female.marriedSenior : format.female.marriedAdult;
                topLine = template
                    .replace('{夫姓}', husbandName || '')
                    .replace('{本姓}', lastName)
                    .replace('{結尾}', ending);
            } else {
                topLine = format.female.unmarried
                    .replace('{姓}', lastName)
                    .replace('{名}', firstName)
                    .replace('{結尾}', ending);
            }
        }
    } else {
        // 基督教/天主教格式
        const subType = isBaptized ? 'baptized' : 'general';
        const template = format[gender][subType];
        topLine = template
            .replace('{姓}', lastName)
            .replace('{名}', firstName);
    }

    // 依據關係精細決定下款
    let footerSuffix = '敬輓';
    switch (relation) {
        case 'parents':
        case 'grandparents':
            footerSuffix = '泣淚拜輓'; 
            break;
        case 'spouse':
        case 'siblings':
            footerSuffix = '泣輓'; 
            break;
        case 'in_laws':     // 岳父母/公婆
            footerSuffix = '叩輓'; 
            break;
        case 'junior':      // 亡者是晚輩
            footerSuffix = '悼'; 
            break;
        case 'friend':
        case 'colleague':
        default:
            footerSuffix = '敬輓'; 
            break;
    }

    const footerOptions = ['悼', '敬輓', '泣輓', '叩輓', '泣淚拜輓', '拜輓'];
    if (religionKey !== 'general') {
        footerOptions.push('In Memory');
    }

    return {
        topLine: topLine,
        middleLine: phrase,
        bottomLine: `${senderName} ${footerSuffix}`,
        validEndings: religionKey === 'general' ? Object.values(format.endings) : format.endings,
        footerOptions: footerOptions
    };
}

// ===== 取得適用的結尾用詞 =====
function getValidEndings(religion) {
    const religionKey = (religion === 'christian' || religion === 'catholic') ? religion : 'general';
    const endings = funeralPhraseDB.cardFormat[religionKey].endings;
    return Array.isArray(endings) ? endings : Object.values(endings);
}

// 匯出
if (typeof module !== 'undefined') {
    module.exports = { funeralPhraseDB, celebrationPhraseDB, getCelebrationPhrases, getFuneralPhrases, generateCardFormat, getValidEndings };
}
