import { AssessmentInput } from '@/types/assessment'

export const sampleAssessmentInput: AssessmentInput = {
  resident_name: '田中 花子',
  birth_date: '1940-05-15',
  age: '85',
  gender: '女性',
  care_level: '要介護3',
  certification_period: '2026-04-01 〜 2027-03-31',
  family_structure: '長男夫婦と同居（長男60歳・会社員、長男の妻58歳・パート勤務）',
  primary_caregiver: '長男の妻（日中はパート勤務のため不在がち）',
  staff_name: '佐藤 太郎',
  record_date: new Date().toISOString().split('T')[0],

  disease: '高血圧症、2型糖尿病、変形性膝関節症、軽度アルツハイマー型認知症',
  vitals: { bp: '138/82', temp: '36.4', spo2: '97', pulse: '76' },
  medications: 'アムロジピン5mg（朝食後）、メトホルミン500mg（朝夕食後）、ドネペジル5mg（朝食後）、ロキソプロフェン60mg（疼痛時）',
  primary_doctor: '山田医院 山田一郎医師（内科・月2回往診）',

  adl: {
    eating: '自立',
    toileting: '一部介助',
    bathing: '全介助',
    mobility: '一部介助',
    dressing: '一部介助',
    grooming: '一部介助',
  },

  iadl: {
    cooking: '全介助',
    laundry: '全介助',
    cleaning: '全介助',
    shopping: '全介助',
    money_management: '全介助',
    medication_management: '一部介助',
    phone: '一部介助',
    transportation: '全介助',
  },

  dementia_level: 'IIb',
  disability_level: 'A2',
  communication: '簡単な会話は可能。時折、同じ話を繰り返すことがある。指示理解はゆっくり話せば可能。難聴なし。',
  problematic_behavior: '夕方になると落ち着きがなくなり、「家に帰りたい」と繰り返すことがある（夕暮れ症候群）。夜間にトイレの場所がわからず廊下を歩き回ることがある。',

  housing_type: '木造2階建て（1階居室）、トイレ・浴室は1階。玄関に段差あり。',
  barrier_free: '廊下・トイレに手すり設置済み。浴室は未改修（またぎが高い）。居室からトイレまで約8m。',
  social_participation: '週1回デイサービスに通所。近所付き合いは減少傾向。以前は俳句の会に参加していた。',
  current_services: '通所介護（週2回）、訪問介護（週3回・入浴介助と生活援助）、訪問看護（週1回・バイタル確認と服薬管理）',

  chief_complaint: '膝が痛くて歩くのがつらい。お風呂に一人で入れなくなった。物忘れが増えて不安。',
  resident_wish: 'できるだけ自分の足で歩き続けたい。家族に迷惑をかけたくない。',
  family_wish: '安全に生活してほしい。入浴や夜間のトイレが心配。認知症の進行をできるだけ遅らせたい。',
  special_notes: '夜間のトイレ回数が増加傾向（1〜3回/夜）。転倒歴あり（3ヶ月前に廊下で転倒、打撲のみ）。甘いものが好きで血糖コントロールに注意が必要。',
}
