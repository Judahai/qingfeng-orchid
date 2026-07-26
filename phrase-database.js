// ===============================================
// 慶豐蘭業 - 喪禮卡片用詞資料庫 v5
// 陣列為資料來源，標籤索引於載入時自動建立，不需手動轉檔
// ===============================================

// ===== 異體字／錯字合併（左 → 右）=====
const PHRASE_VARIANTS = {
    '華開見佛': '花開見佛',   // 店主確認：花開見佛 為正確
    '長才未竟': '長才未盡',   // 店主確認：長才未盡 為正確
    '慈雲缥緲': '慈雲縹緲',
    '駕賀西歸': '駕鶴西歸',   // 疑為錯字，若確實有此寫法請刪掉這行
    '婺星光黯': '婺星光暗',   // 兩種寫法都出現過，暫統一用「暗」
};

// ===== 停用清單：不刪詞，只關掉 =====
// 覺得某句不適合就加進來，附一句原因。日後要開回來把該行刪掉即可。
const DISABLED_PHRASES = {
    // '某句詞': '太文言，客人看不懂',
};

// 基督教／天主教不可用（道教、民間信仰色彩明顯）
const NON_CHRISTIAN_PHRASES = [
    '駕鶴西歸', '羽化登仙', '蓬島歸真', '仙凡路隔', '返璞歸真', '歸真返璞',
    '瑤池赴召', '寶婺星沉', '駕返瑤池', '跨鶴仙鄉', '瑤島仙遊', '仙遊上界',
    '慈雲歸岫', '慈雲西逝'
];

const AGE_BANDS = {
    under49:   [0, 49],
    age50to69: [50, 69],
    age70to79: [70, 79],
    age80plus: [80, 120]
};

const funeralPhraseDB = {

    // ===== 卡片格式範本 =====
    // 模板只到稱謂，結尾敬語一律由 composeTopLine() 從 endings 接上
    cardFormat: {
        general: {
            male:   { senior: '敬悼 {姓}公{名} 老先生', adult: '敬悼 {姓}{名} 先生' },
            female: {
                senior: '敬悼 {夫姓}媽{本姓} 老夫人',
                seniorSingle: '敬悼 {姓}{名} 老夫人',
                adult: '敬悼 {姓}{名} 女士'
            },
            footer: '{送禮人} {敬語}',
            endings: ['千古', '仙逝', '往生蓮邦', '往生淨土']
        },
        christian: {
            male: {
                general: '敬悼 {姓}{名} 先生'
            },
            female: {
                general: '敬悼 {姓}{名} 女士'
            },
            footer: '{送禮人} {敬語}',
            endings: ['安息主懷', '榮歸天家', '榮歸天國']
        },
        catholic: {
            male: {
                general: '故 {姓}{名} 先生'
            },
            female: {
                general: '故 {姓}{名} 女士'
            },
            footer: '{送禮人} {敬語}',
            endings: ['蒙主恩召', '魂歸天國']
        }
    },

    // ===== 男喪 =====
    male: {
        under49: [
            '星隕少微', '玉樹長埋', '壯志未酬', '天不假年', '修文赴召',
            '少微星隕', '英年仙去', '英年玉折', '長才未盡', '同體大悲',
            '棟折梁摧', '同悲不捨', '音容宛在', '悵望音容', '英氣頓杳',
            '英風宛在', '英才天妒', '千秋永別', '一別千古', '典則空留', '痛隔天人'
        ],
        // 依店主提供的參考資料：僅這五句延伸至 69 歲，
        // 其餘「英年」類用詞不適用中壯年，故此組不再整份複製
        age50to69: [
            '玉樹長埋', '英氣頓杳', '長才未盡', '痛隔天人', '星隕少微'
        ],
        age70to79: [
            '遽返道山', '儀型足式', '碩德堪欽', '悵望音容', '道範長存',
            '北斗星沉', '返璞歸真', '德業長昭', '駕鶴西歸', '典型宛在',
            '千秋永訣', '海宇風淒', '泰山其頹', '仙凡路隔', '行誼可師',
            '高風亮節', '英風宛在', '高風安仰', '音容如在', '庚星匿彩', '英氣長存'
        ],
        age80plus: [
            '閬苑歸真', '庚星匿彩', '北斗星沉', '蓬島歸真', '羽化登仙',
            '千秋足式', '典則空留', '歸真返璞', '高風亮節', '儀型萬方',
            '桑梓流光', '德範永存', '德望永昭', '道範長存', '斗山安仰',
            '典型足式', '南極星沉', '高山仰止', '碩德貽徽', '儀型足式', '高風安仰'
        ],
        // 男喪通用弔唁詞，不限年齡
        tribute: [
            '福壽全歸', '福慧雙修', '道範長存', '福壽雙全', '駕鶴西歸',
            '德徽永昭', '跨鶴仙鄉', '老成凋謝', '大雅云亡', '斗山共仰',
            '南極星沉', '德望永欽', '碩德永昭', '哲人其萎'
        ]
    },

    // ===== 女喪 =====
    female: {
        under49: [
            '妝台月冷', '涼月淒清', '塵掩妝台', '悵望音容', '魂兮歸來',
            '遽促芳齡', '音容如在', '音容宛在', '幽明永隔', '望斷白雲',
            '銜哀永逝', '閭里銜哀', '音容隔世', '抱恨終天', '花落萱幃',
            '徽音頓渺', '千秋永訣', '悲興風木'
        ],
        age50to69: [
            '妝台月冷', '涼月淒清', '塵掩妝台', '悵望音容', '魂兮歸來',
            '塵榻空留', '同體大悲', '萱萎北堂', '天不假年', '曇花萎謝',
            '遽促芳齡', '繡幃香冷', '玉簫聲斷', '忘憂草謝', '音容如在',
            '鵑聲月寒', '同悲不捨', '慈雲縹緲', '持家有則', '坤儀足式'
        ],
        age70to79: [
            '瑤池赴召', '北堂春去', '彤管揚芬', '寶婺星沉', '慈雲縹緲',
            '親恩永懷', '懿德長昭', '範垂巾幗', '彤管流芳', '流芳千古',
            '坤儀足式', '閫範長存', '懿範猶存', '悲興風木', '名標彤史',
            '淑德永昭', '母儀千古', '母儀足式', '溫恭淑慎', '慈暉永懷',
            '孟母風高', '賢同歐母'
        ],
        age80plus: [
            '萱儀足式', '萱範長存', '懿德長昭', '彤管流芳', '溫恭淑慎',
            '淑德永昭', '母儀千古', '母儀足式', '萱萎北堂', '懿範垂型',
            '五福全歸', '坤儀宛在', '母儀永懷', '永懷親恩', '慈暉長照', '慈暉永懷'
        ],
        tribute: [
            '慈輝永昭', '懿範永存', '懿德猶存', '慈雲西逝', '女宗共仰',
            '母儀千古', '駕返瑤池', '壺範垂型', '淑德常昭', '母儀足式'
        ]
    },

    // ===== 宗教 =====
    // 道教未獨立分類：道教用詞與一般常用高度重疊，一律歸入 general
    religion: {
        general: ['音容宛在', '典範長存', '駕鶴西歸', '德範永存', '永懷不忘'],
        buddhist: [
            '高登蓮品', '上品上生', '功德圓滿', '澤在人間', '悲願宏深',
            '乘願再來', '花開見佛', '人天安仰', '往生蓮邦', '往生極樂',
            '超生極樂', '神超淨域', '往生西方', '接引西方', '圓超五濁',
            '俯謝娑婆', '神遊極樂', '神歸極樂', '神歸安養', '神歸淨土',
            '神歸樂國', '神歸淨域', '往生樂土', '土歸寂光', '果證菩提',
            '生西現瑞', '念佛往生', '欣登彼岸', '往生彼岸', '蛻然西歸',
            '佛果圓成', '見佛證果', '果證無生', '悟證無生', '非去非來',
            '復來度蒙', '倒駕慈航', '入聖超凡', '安詳捨報', '華開蓮剎',
            '彌陀接引', '法燈隱耀', '法燈乍晦', '慧燈遽晦', '成菩提道',
            '菩提果圓', '菩提圓成', '佛道圓成', '蓮池證果', '慧炬長明',
            '炬光永曜', '位登上品', '駕返蓮邦', '彌陀笑迎', '蓮開寶沼',
            '歸西證果', '西歸蓮域', '遠塵離垢', '覺行圓滿', '蓮沼映輝',
            '蓮邦永托', '念佛生西', '慈光常住', '返真蓮域', '親近諸佛',
            '天樂鳴空', '護國弘教', '慧光溥昭', '宏教垂範', '化生蓮邦'
        ],
        yiguandao: [
            '回歸理天', '靈歸無極', '返樸歸真', '駕返瑤池',
            '圓覺歸真', '駕返理天', '認理歸真', '功圓果滿'
        ],
        tiandijiao: ['功果圓滿', '天帝寵召', '昇天歸位', '回歸自然'],
        christian: [
            '主懷安息', '在主懷抱', '天國永生', '安息主懷', '息勞歸主',
            '榮歸天國', '永光照之', '永遠懷念', '睡主懷中', '耶穌是主',
            '與主偕行', '與主永偕', '蒙主恩加', '釋勞歸主', '蒙主寵召',
            '永息主懷', '魂登天國', '榮返天鄉', '駕返帝鄉', '永在主前',
            '主懷長生', '永在天國'
        ],
        catholic: ['魂歸天國', '蒙主寵召', '永遠懷念', '榮歸天家', '安然見主']
    },

    // ===== 職業 =====
    profession: {
        politician: [
            '邦國精華', '甘棠遺愛', '國失賢良', '耆德元勛', '峴首留碑',
            '勛猷共仰', '忠勤足式', '才厄經綸', '遺愛人間', '萬姓謳思'
        ],
        teacher: [
            '馬帳安仰', '風冷杏壇', '桃李興悲', '立雪神傷', '高山安仰',
            '教澤長存', '教澤永懷', '師表千古', '師表常尊', '永念師恩'
        ],
        scholar: [
            '大雅云亡', '天喪斯文', '立言不朽', '絕學千秋', '學究天人',
            '世失英才', '少微斂曜', '言行足式', '文壇失仰', '文曲光沉', '望尊泰斗'
        ]
    },

    // ===== 友人通用（女喪用詞佔多數，由索引自動判斷性別）=====
    friend: [
        '痛失知音', '話冷雞窗', '心傷畏友', '響絕牙琴', '人琴俱亡',
        '伊人宛在', '範垂巾幗', '福壽全歸', '彤管流芳', '丹管流芬',
        '女界典型', '流芳千古', '涼月淒清', '蓼莪詩廢', '鸞軿遽返',
        '鸞馭遐升', '閨閫之師', '坤儀足式', '坤儀宛在', '閫範空存',
        '閫範長存', '空仰慈顏', '海宗風淒', '花落萱幃', '徽音頓渺',
        '徽音遠播', '魂兮歸來', '巾幗稱賢', '巾幗儀型', '千秋永訣',
        '繡閣風寒', '仙凡路隔', '仙遊上界', '賢同歐母', '香消玉殞',
        '萱堂露冷', '萱蔭長留', '鍾郝儀型', '持家有則', '淑德永昭',
        '慈竹風淒', '慈竹風摧', '慈雲縹緲', '懿範猶存', '懿德堪欽',
        '懿德長昭', '瑤島仙遊', '瑤池赴召', '音容如在', '音容宛在',
        '五福全歸', '婺星光暗', '婺彩沉輝', '溫恭淑慎', '忘憂草謝',
        '月缺花殘', '母儀千古', '母儀足式', '母儀永式', '女宗共仰',
        '女宗安仰', '駕返瑤池', '萱幃月冷', '萱萎北堂', '慈萱永謝',
        '慈雲歸岫', '懿範垂型', '月冷西池'
    ]
};

// ===============================================
// 標籤索引：載入時自動建立
// ===============================================
function buildPhraseIndex(db) {
    const index = new Map();
    const norm = t => PHRASE_VARIANTS[t] || t;

    function put(rawText, patch, source) {
        const text = norm(rawText);
        let rec = index.get(text);
        if (!rec) {
            rec = { text, gender: undefined, ageMin: undefined, ageMax: undefined,
                    religion: new Set(), profession: new Set(), sources: new Set() };
            index.set(text, rec);
        }
        rec.sources.add(source);
        if (patch.gender !== undefined) {
            if (rec.gender === undefined) rec.gender = patch.gender;
            else if (rec.gender !== patch.gender) rec.gender = null;  // 男女都有 → 不限
        }
        if (patch.ageMin !== undefined) {
            rec.ageMin = rec.ageMin === undefined ? patch.ageMin : Math.min(rec.ageMin, patch.ageMin);
            rec.ageMax = rec.ageMax === undefined ? patch.ageMax : Math.max(rec.ageMax, patch.ageMax);
        }
        if (patch.religion) rec.religion.add(patch.religion);
        if (patch.profession) rec.profession.add(patch.profession);
    }

    ['male', 'female'].forEach(g => {
        Object.entries(AGE_BANDS).forEach(([band, [lo, hi]]) => {
            (db[g]?.[band] || []).forEach(t => put(t, { gender: g, ageMin: lo, ageMax: hi }, `${g}.${band}`));
        });
        (db[g]?.tribute || []).forEach(t => put(t, { gender: g, ageMin: 0, ageMax: 120 }, `${g}.tribute`));
    });

    Object.entries(db.religion || {}).forEach(([rel, list]) =>
        list.forEach(t => put(t, { religion: rel }, `religion.${rel}`)));

    Object.entries(db.profession || {}).forEach(([prof, list]) =>
        list.forEach(t => put(t, { profession: prof }, `profession.${prof}`)));

    (db.friend || []).forEach(t => put(t, {}, 'friend'));

    return [...index.values()].map(r => ({
        text: r.text,
        gender: r.gender === undefined ? null : r.gender,
        ageMin: r.ageMin === undefined ? 0 : r.ageMin,
        ageMax: r.ageMax === undefined ? 120 : r.ageMax,
        religion: [...r.religion],
        profession: [...r.profession],
        friendOnly: r.sources.size === 1 && r.sources.has('friend'),
        noChristian: NON_CHRISTIAN_PHRASES.includes(r.text),
        enabled: !(r.text in DISABLED_PHRASES),
        note: DISABLED_PHRASES[r.text] || '',
        sources: [...r.sources]
    }));
}

const PHRASE_INDEX = buildPhraseIndex(funeralPhraseDB);

// ===============================================
// 查詢
// ===============================================
function getFuneralPhrases({ gender, age, religion, profession, isFriend } = {}) {
    const numAge = Number(age);
    if (!Number.isFinite(numAge) || numAge < 0 || numAge > 120) {
        console.warn('[getFuneralPhrases] ⚠️ 年齡無效或未填:', age);
        return [];
    }
    if (gender !== 'male' && gender !== 'female') {
        console.warn('[getFuneralPhrases] ⚠️ 性別未填或無效:', gender);
        return [];
    }
    return PHRASE_INDEX.filter(p => {
        if (!p.enabled) return false;
        if (p.gender && p.gender !== gender) return false;
        if (numAge < p.ageMin || numAge > p.ageMax) return false;
        if (p.religion.length && !p.religion.includes(religion)) return false;
        if (p.profession.length && (!profession || !p.profession.includes(profession))) return false;
        if (p.friendOnly && !isFriend) return false;
        if (religion === 'christian' || religion === 'catholic') {
            if (p.noChristian) return false;
            if (p.text.includes('千古')) return false;
        }
        return true;
    }).map(p => p.text);
}

// ===============================================
// 卡片格式
// ===============================================
function assertGender(gender, fnName) {
    if (gender !== 'male' && gender !== 'female') {
        console.warn(`[${fnName}] ⚠️ 性別未填或無效:`, gender);
        return null;
    }
    return gender;
}

// 下款：主詞是訂花的人，不是往生者
function getFooterSuffix({ isBereaved, seniority } = {}) {
    if (isBereaved === true) return '泣輓';
    if (isBereaved !== false) {
        console.warn('[getFooterSuffix] ⚠️ isBereaved 未填，退回敬輓。前端要問這一題。');
        return '敬輓';
    }
    return seniority === 'junior' ? '拜輓' : '敬輓';
}

function composeTopLine(nameBlock, ending, religionKey) {
    const valid = funeralPhraseDB.cardFormat[religionKey].endings;
    const safeEnding = valid.includes(ending) ? ending : valid[0];
    return `${nameBlock} ${safeEnding}`;
}

// 「府」：年輕往生者才用。界線由 FU_AGE_THRESHOLD 控制，可隨時調整，
// 後台也可用 useFuStyle 直接覆寫（true/false）。
const FU_AGE_THRESHOLD = 50;

function applyFuStyle(nameBlock, lastName, age, useFuStyle) {
    const should = (useFuStyle === undefined) ? (Number(age) < FU_AGE_THRESHOLD) : !!useFuStyle;
    return should ? nameBlock.replace(lastName, `${lastName}府`) : nameBlock;
}

function generateCardFormat(options) {
    const {
        gender, age, lastName, firstName, husbandName, isMarried,
        useHusbandSurname = true, isSenior = age >= 80,
        religion, senderName, phrase, ending,
        isBereaved, seniority, useFuStyle
    } = options;

    const safeGender = assertGender(gender, 'generateCardFormat');
    if (!safeGender) return null;

    const religionKey = (religion === 'christian' || religion === 'catholic') ? religion : 'general';
    const format = funeralPhraseDB.cardFormat[religionKey];
    let nameBlock;

    if (religionKey !== 'general') {
        nameBlock = format[safeGender].general
            .replace('{姓}', lastName).replace('{名}', firstName);
    } else if (safeGender === 'male') {
        nameBlock = (isSenior ? format.male.senior : format.male.adult)
            .replace('{姓}', lastName).replace('{名}', firstName);
    } else if (isSenior && isMarried && useHusbandSurname) {
        nameBlock = format.female.senior
            .replace('{夫姓}', husbandName || '').replace('{本姓}', lastName).replace('{名}', firstName);
    } else if (isSenior) {
        nameBlock = format.female.seniorSingle
            .replace('{姓}', lastName).replace('{名}', firstName);
    } else {
        nameBlock = format.female.adult
            .replace('{姓}', lastName).replace('{名}', firstName);
    }

    if (religionKey === 'general') {
        nameBlock = applyFuStyle(nameBlock, lastName, age, useFuStyle);
    }

    return {
        topLine: composeTopLine(nameBlock, ending, religionKey),
        middleLine: phrase,
        bottomLine: `${senderName} ${getFooterSuffix({ isBereaved, seniority })}`,
        validEndings: format.endings,
        footerOptions: ['敬輓', '泣輓', '拜輓'],
        internalId: [lastName || '', firstName || '', safeGender === 'male' ? 'M' : 'F',
                     age || '?', Date.now().toString(36).slice(-4)].join('-')
    };
}

function getValidEndings(religion) {
    const key = (religion === 'christian' || religion === 'catholic') ? religion : 'general';
    return funeralPhraseDB.cardFormat[key].endings;
}

if (typeof module !== 'undefined') {
    module.exports = { funeralPhraseDB, PHRASE_INDEX, getFuneralPhrases,
                       generateCardFormat, getValidEndings };
}
