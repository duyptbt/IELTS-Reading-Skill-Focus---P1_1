import {
  VocabularyItem,
  GrammarStructureItem,
  ParaphrasePair,
  MatchingTaskItem,
  GapFillTaskItem,
  ReferenceTaskItem,
  TransformationTaskItem,
} from '../types';

export const CONSOLIDATION_VOCABULARY: VocabularyItem[] = [
  {
    id: 'v1',
    word: 'Profound',
    phonetic: '/prəˈfaʊnd/',
    partOfSpeech: 'adjective',
    definition: 'Very great, intense, or having deep meaning and far-reaching effect.',
    definitionVi: 'Rất to lớn, sâu sắc, có ý nghĩa quan trọng hoặc ảnh hưởng sâu rộng.',
    vietnameseMeaning: 'Sâu sắc, to lớn, có tầm ảnh hưởng sâu rộng',
    passageContext:
      'A beautifully preserved boat, made around 3,000 years ago and discovered by chance in a muddy hole, has had a profound impact on archaeological research.',
    paragraphRef: 1,
    collocations: ['profound impact', 'profound effect', 'profound insight', 'profound influence'],
    synonyms: ['momentous', 'far-reaching', 'deep', 'significant'],
    ieltsBand: 'Band 7.5+',
  },
  {
    id: 'v2',
    word: 'Sediment',
    phonetic: '/ˈsed.ɪ.mənt/',
    partOfSpeech: 'noun',
    definition:
      'Matter that settles to the bottom of a liquid, or mineral/organic material deposited by water or wind.',
    definitionVi: 'Lớp vật chất lắng xuống đáy chất lỏng, hoặc trầm tích khoáng/hữu cơ do nước hay gió bồi tụ.',
    vietnameseMeaning: 'Trầm tích, lớp cặn lắng tự nhiên',
    passageContext:
      'They had found a prehistoric boat, preserved by the type of sediment in which it was buried. It was then named the Dover Bronze-Age Boat.',
    paragraphRef: 2,
    collocations: ['layer of sediment', 'sediment deposit', 'fine sediment', 'river sediment'],
    synonyms: ['silt', 'deposit', 'residue', 'alluvium'],
    ieltsBand: 'Band 7.0+',
  },
  {
    id: 'v3',
    word: 'Intricately',
    phonetic: '/ˈɪn.trɪ.kət.li/',
    partOfSpeech: 'adverb',
    definition: 'In a very detailed, complicated, or elaborate manner.',
    definitionVi: 'Một cách hết sức tỉ mỉ, công phu, tinh xảo và phức tạp.',
    vietnameseMeaning: 'Một cách tỉ mỉ, tinh xảo, phức tạp',
    passageContext:
      'What survived consisted essentially of four intricately carved oak planks: two on the bottom, joined along a central seam by a complicated system of wedges and timbers...',
    paragraphRef: 3,
    collocations: ['intricately carved', 'intricately designed', 'intricately woven', 'intricately connected'],
    synonyms: ['elaborately', 'meticulously', 'complexly', 'finely'],
    ieltsBand: 'Band 8.0+',
  },
  {
    id: 'v4',
    word: 'Antiquity',
    phonetic: '/ænˈtɪk.wə.ti/',
    partOfSpeech: 'noun',
    definition: 'The ancient past, especially the period of early human history or ancient civilizations.',
    definitionVi: 'Thời cổ đại, đặc biệt là giai đoạn lịch sử ban sơ hoặc các nền văn minh thời tiền sử/cổ xưa.',
    vietnameseMeaning: 'Thời cổ đại, thời xưa',
    passageContext:
      'The timbers that closed the recovered end of the boat had been removed in antiquity when it was abandoned, but much about its original shape could be deduced.',
    paragraphRef: 4,
    collocations: ['in antiquity', 'classical antiquity', 'relics of antiquity', 'dating back to antiquity'],
    synonyms: ['ancient times', 'the distant past', 'early history'],
    ieltsBand: 'Band 7.5+',
  },
  {
    id: 'v5',
    word: 'Deduce',
    phonetic: '/dɪˈdjuːs/',
    partOfSpeech: 'verb',
    definition: 'To reach a logical conclusion from information, facts, or evidence available.',
    definitionVi: 'Rút ra kết luận logic dựa trên các thông tin, sự kiện hoặc bằng chứng hiện có.',
    vietnameseMeaning: 'Suy luận, suy ra (từ bằng chứng)',
    passageContext:
      '...the timbers that closed the recovered end of the boat had been removed in antiquity when it was abandoned, but much about its original shape could be deduced.',
    paragraphRef: 4,
    collocations: ['logically deduce', 'can be deduced from', 'readily deduced', 'deduce findings'],
    synonyms: ['infer', 'conclude', 'derive', 'reason'],
    ieltsBand: 'Band 7.5+',
  },
  {
    id: 'v6',
    word: 'Hindsight',
    phonetic: '/ˈhaɪnd.saɪt/',
    partOfSpeech: 'noun',
    definition:
      'Understanding of a situation or event only after it has happened or developed.',
    definitionVi: 'Sự thấu hiểu hoặc đánh giá một sự việc sau khi nó đã diễn ra (nhìn lại quá khứ).',
    vietnameseMeaning: 'Sự nhận thức muộn màng, nhìn lại quá khứ',
    passageContext:
      'With hindsight, it was significant that the boat was found and studied by mainstream archaeologists who naturally focused on its cultural context.',
    paragraphRef: 5,
    collocations: ['with hindsight', 'in hindsight', 'benefit of hindsight', 'wisdom of hindsight'],
    synonyms: ['retrospect', 'afterthought', 'retrospective appraisal'],
    ieltsBand: 'Band 8.0+',
  },
  {
    id: 'v7',
    word: 'Insurmountable',
    phonetic: '/ˌɪn.səˈmaʊn.tə.bəl/',
    partOfSpeech: 'adjective',
    definition: 'Too great to be overcome, resolved, or accomplished.',
    definitionVi: 'Quá lớn đến mức không thể vượt qua, giải quyết hay khắc phục được (khó khăn, thử thách).',
    vietnameseMeaning: 'Không thể vượt qua được (khó khăn, trở ngại)',
    passageContext:
      '...practical and financial difficulties were insurmountable – and there was no guarantee that the timbers had survived the previous decade in the changed environment.',
    paragraphRef: 6,
    collocations: ['insurmountable difficulties', 'insurmountable obstacles', 'insurmountable challenges'],
    synonyms: ['insuperable', 'unconquerable', 'hopeless', 'impossible'],
    ieltsBand: 'Band 8.0+',
  },
  {
    id: 'v8',
    word: 'Straddle',
    phonetic: '/ˈstræd.əl/',
    partOfSpeech: 'verb',
    definition: 'To extend across or be situated on both sides of a channel, border, boundary, or era.',
    definitionVi: 'Nằm trải dài hoặc vươn ra hai bên của một eo biển, biên giới hoặc ranh giới.',
    vietnameseMeaning: 'Trải dài / nối liền hai bờ ranh giới',
    passageContext:
      'Archaeological evidence was beginning to suggest a Bronze-Age community straddling the Channel, brought together by the sea, rather than separated by it.',
    paragraphRef: 7,
    collocations: ['straddling the Channel', 'straddling borders', 'straddling boundaries', 'straddling two eras'],
    synonyms: ['spanning', 'bridging', 'crossing', 'extending across'],
    ieltsBand: 'Band 7.5+',
  },
  {
    id: 'v9',
    word: 'Centrepiece',
    phonetic: '/ˈsen.tə.piːs/',
    partOfSpeech: 'noun',
    definition: 'An item or aspect intended to be the most important, prominent, or central part of something.',
    definitionVi: 'Vật phẩm hoặc khía cạnh được coi là quan trọng nhất, nổi bật nhất hoặc làm điểm nhấn trung tâm của một sự kiện/bộ sưu tập.',
    vietnameseMeaning: 'Điểm nhấn trung tâm, tác phẩm tâm điểm',
    passageContext:
      'The reconstructed boat, as a symbol of the maritime connections that bound together the communities either side of the Channel, was the centrepiece.',
    paragraphRef: 10,
    collocations: ['exhibition centrepiece', 'centrepiece of a collection', 'act as the centrepiece'],
    synonyms: ['focal point', 'highlight', 'main attraction', 'core feature'],
    ieltsBand: 'Band 7.0+',
  },
];

export const CONSOLIDATION_GRAMMAR: GrammarStructureItem[] = [
  {
    id: 'g1',
    name: 'Modal Passive for Scientific & Historical Inference',
    category: 'Academic Passives',
    formula: '[Subject] + modal verb (could / would / must) + be + [Past Participle] (+ by-phrase)',
    passageExample:
      '...the timbers that closed the recovered end of the boat had been removed in antiquity when it was abandoned, but much about its original shape could be deduced.',
    paragraphRef: 4,
    explanation:
      'In academic and archaeological texts, researchers frequently make cautious deductions where certainty is not absolute. Using modal passives ("could be deduced", "would permit assessment") maintains academic objectivity without overclaiming facts.',
    explanationVi:
      'Trong văn bản học thuật và khảo cổ, các nhà nghiên cứu thường đưa ra suy luận thận trọng khi độ chính xác chưa tuyệt đối 100%. Cấu trúc bị động với động từ khuyết thiếu ("could be deduced", "would permit assessment") giúp duy trì tính khách quan khoa học.',
    ieltsApplication:
      'Crucial for IELTS Academic Writing Task 1 (describing inferred trends) and Task 2 (presenting balanced arguments cautiously).',
    practiceExample:
      'The technological sophistication of Bronze-Age maritime trade can be deduced from archaeological discoveries across northwest Europe.',
  },
  {
    id: 'g2',
    name: 'Fronted Participle Clauses of Circumstance & Background',
    category: 'Clause Combining',
    formula: '[Present Participle (-ing phrase)], [Main Independent Clause]',
    passageExample:
      'Cleaning away the waterlogged site overlying the timbers, archaeologists realised its true nature.',
    paragraphRef: 2,
    explanation:
      'Fronted participial phrases allow writers to combine chronological background actions and immediate realisations into a single cohesive sentence, enhancing grammatical density.',
    explanationVi:
      'Mệnh đề phân từ đứng đầu câu (V-ing đứng trước) cho phép kết hợp hành động bối cảnh và kết quả/nhận thức trực tiếp vào một câu duy nhất, gia tăng độ liên kết và độ phong phú ngữ pháp (Grammatical Range).',
    ieltsApplication:
      'Using participle clauses instead of repetitive "When they did X, they did Y" significantly boosts the Grammatical Range & Accuracy criterion (Band 8+).',
    practiceExample:
      'Examining the preserved oak timbers, researchers identified moss pads and yew stitching designed for watertight seafaring.',
  },
  {
    id: 'g3',
    name: 'Contrastive Clauses with "Rather than"',
    category: 'Complex Cohesion',
    formula: '[Main Clause / Participle phrase], rather than + [Parallel Noun / Participle Phrase]',
    passageExample:
      '...a Bronze-Age community straddling the Channel, brought together by the sea, rather than separated by it.',
    paragraphRef: 7,
    explanation:
      '"Rather than" sets up a sharp contrast or refutes a common misconception, emphasizing the factual or preferred interpretation over the alternative.',
    explanationVi:
      'Liên từ "Rather than" tạo nên sự tương phản sắc sảo hoặc bác bỏ một quan niệm sai lầm phổ biến, nhấn mạnh cách giải thích chính xác thay vì quan điểm đối lập.',
    ieltsApplication:
      'Superb stylistic tool for IELTS Task 2 thesis statements and topic sentences where you contrast your stance with conventional thinking.',
    practiceExample:
      'Ancient maritime communities viewed coastal waters as connective trade routes, rather than insurmountable barriers.',
  },
  {
    id: 'g4',
    name: 'Nominalization in Chronological Project Descriptions',
    category: 'Nominalization & Style',
    formula: '[Determiner/Adjective] + [Nominalized Abstract Noun (e.g. launch, proposal, assessment)] + of + [Noun Phrase]',
    passageExample:
      '...and an official launch of the project was held at an international seminar in France in 2007.',
    paragraphRef: 8,
    explanation:
      'Academic English packages complex actions into compact noun phrases (nominalizations like "the launch of the project", "proposals for reconstruction", "assessment of the hypotheses") to create formal cohesion.',
    explanationVi:
      'Tiếng Anh học thuật đóng gói các hành động phức tạp thành các cụm danh từ cô đọng (danh từ hóa như "the launch of the project", "proposals for reconstruction") để tạo phong cách trang trọng và mạch lạc.',
    ieltsApplication:
      'Used heavily in Academic Writing Task 1 to describe process stages, project milestones, and historical timelines with mature vocabulary.',
    practiceExample:
      'The successful completion of the half-scale reconstruction provided valuable insights into prehistoric shipbuilding techniques.',
  },
];

export const CONSOLIDATION_PARAPHRASES: ParaphrasePair[] = [
  {
    id: 'p1',
    originalText:
      '...workmen were building a new road through the heart of Dover, to connect the ancient port and the Channel Tunnel...',
    paraphrasedText:
      '1992 – the boat was discovered during the construction of a road (Q1)',
    technique: 'Nominalization & Chronological Framing',
    explanation:
      'The active verbal clause "workmen were building a new road" is nominalized into "the construction of a road", matching the flow-chart summary.',
    paragraphRef: 1,
  },
  {
    id: 'p2',
    originalText:
      'The boat was not a wreck, but had been deliberately discarded, dismantled and broken.',
    paraphrasedText:
      'Archaeologists realised that the boat had been damaged on purpose. (TRUE, Q6)',
    technique: 'Synonym Replacement & Semantic Equivalence',
    explanation:
      '"deliberately" directly equates to "on purpose", and "discarded, dismantled and broken" equates to "damaged".',
    paragraphRef: 4,
  },
  {
    id: 'p3',
    originalText:
      'With hindsight, it was significant that the boat was found and studied by mainstream archaeologists who naturally focused on its cultural context. At the time, ancient boats were often considered only from a narrower technological perspective...',
    paraphrasedText:
      'Initially, only the technological aspects of the boat were examined. (FALSE, Q7)',
    technique: 'Contrastive Negation & Scope Verification',
    explanation:
      'The text contrasts general historical boat research (narrowly technological) with the Dover boat, which was specifically studied for its cultural context from the outset.',
    paragraphRef: 5,
  },
  {
    id: 'p4',
    originalText:
      "The possibility of returning to Dover to search for the boat's unexcavated northern end was explored, but practical and financial difficulties were insurmountable...",
    paraphrasedText:
      'Archaeologists went back to the site to try and find the missing northern end of the boat. (FALSE, Q8)',
    technique: 'Fact vs. Intent Distinction',
    explanation:
      'The text confirms that returning was only "explored" as a possibility and abandoned because hurdles were "insurmountable". They did not actually return.',
    paragraphRef: 6,
  },
  {
    id: 'p5',
    originalText:
      'It was decided to make the replica half-scale for reasons of cost and time...',
    paraphrasedText:
      'Which two factors influenced the decision not to make a full-scale reconstruction of the boat? (cost and time, Q13)',
    technique: 'Paraphrasing Reasons & Dimensions',
    explanation:
      '"half-scale" corresponds to "not to make a full-scale reconstruction", and "for reasons of" maps to "factors influenced the decision".',
    paragraphRef: 9,
  },
];

export const MATCHING_TASKS: MatchingTaskItem[] = [
  {
    id: 'm1',
    term: 'Profound',
    definition: 'Very great, intense, or having far-reaching impact on knowledge',
    context: '...has had a profound impact on archaeological research.',
  },
  {
    id: 'm2',
    term: 'Sediment',
    definition: 'Mineral or organic silt and mud deposited by water and preserving ancient timbers',
    context: '...preserved by the type of sediment in which it was buried.',
  },
  {
    id: 'm3',
    term: 'Intricately',
    definition: 'In a highly elaborate, detailed, and meticulous manner',
    context: '...consisted essentially of four intricately carved oak planks.',
  },
  {
    id: 'm4',
    term: 'Insurmountable',
    definition: 'Too severe or difficult to overcome or resolve',
    context: '...practical and financial difficulties were insurmountable.',
  },
  {
    id: 'm5',
    term: 'Centrepiece',
    definition: 'The most prominent or important item displayed in an exhibition',
    context: 'The reconstructed boat... was the centrepiece.',
  },
];

export const GAP_FILL_TASKS: GapFillTaskItem[] = [
  {
    id: 'g1',
    sentence:
      'The discovery of the 3,000-year-old vessel had a [blank] impact on prehistoric archaeological scholarship.',
    targetWord: 'profound',
    options: ['profound', 'slight', 'insurmountable', 'sediment'],
    hint: 'Looking for an adjective meaning deep, momentous, or far-reaching.',
    explanation:
      'Paragraph 1 notes that the discovery had a "profound impact" on archaeological research.',
  },
  {
    id: 'g2',
    sentence:
      'Because the oak timbers were sealed within waterlogged [blank], they remained intact for over three millennia.',
    targetWord: 'sediment',
    options: ['sediment', 'antiquity', 'proposals', 'stitches'],
    hint: 'A geological noun referring to layers of mud and mineral deposits.',
    explanation:
      'Paragraph 2 explains that the boat was "preserved by the type of sediment in which it was buried".',
  },
  {
    id: 'g3',
    sentence:
      'Although only nine metres were recovered, researchers [blank] the complete hull outline from surviving timbers.',
    targetWord: 'deduced',
    options: ['deduced', 'straddled', 'discarded', 'collaborated'],
    hint: 'A past tense verb meaning logically inferred or worked out from clues.',
    explanation:
      'Paragraph 4 states that "much about its original shape could be deduced".',
  },
  {
    id: 'g4',
    sentence:
      'Evidence suggested a unified Bronze-Age maritime community [blank] the English Channel.',
    targetWord: 'straddling',
    options: ['straddling', 'dismantling', 'launching', 'overlying'],
    hint: 'A participle meaning spanning or extending across both sides of a body of water.',
    explanation:
      'Paragraph 7 describes "a Bronze-Age community straddling the Channel, brought together by the sea".',
  },
  {
    id: 'g5',
    sentence:
      'The reconstructed half-scale replica served as the [blank] of the 2012 Boulogne-sur-Mer exhibition.',
    targetWord: 'centrepiece',
    options: ['centrepiece', 'hindsight', 'tradition', 'perspective'],
    hint: 'A noun meaning the central, most prominent feature or star attraction.',
    explanation:
      'Paragraph 10 confirms that the reconstructed boat "was the centrepiece" of the exhibition.',
  },
];

export const REFERENCE_TASKS: ReferenceTaskItem[] = [
  {
    id: 'r1',
    question: 'In Paragraph 1, what does the relative pronoun "which" refer to?',
    quote:
      '"...to connect the ancient port and the Channel Tunnel, which, when it opened just two years later, was to be the first land link between Britain and Europe for over 10,000 years."',
    paragraphRef: 1,
    options: [
      'The Channel Tunnel',
      'The ancient port of Dover',
      'The new road',
      'Canterbury Archaeological Trust',
    ],
    correctIndex: 0,
    explanation:
      'The relative clause "which, when it opened just two years later..." refers directly to the immediately preceding antecedent "the Channel Tunnel".',
  },
  {
    id: 'r2',
    question: 'In Paragraph 2, what does the possessive pronoun "its" refer to?',
    quote:
      '"Cleaning away the waterlogged site overlying the timbers, archaeologists realised its true nature."',
    paragraphRef: 2,
    options: [
      'The wooden structure revealed at the base of the deep shaft',
      'The modern street level',
      'The Canterbury Archaeological Trust team',
      'The sediment layer',
    ],
    correctIndex: 0,
    explanation:
      '"its true nature" refers back to the wooden structure that they realised was a prehistoric Bronze-Age boat.',
  },
  {
    id: 'r3',
    question: 'In Paragraph 5, what does "this meeting of different traditions" refer to?',
    quote:
      '"...the Dover Bronze-Age Boat Trust hosted a conference, where this meeting of different traditions became apparent."',
    paragraphRef: 5,
    options: [
      'The convergence of technological boat specialists with mainstream cultural/social archaeologists',
      'A diplomatic meeting between England and France',
      'A rivalry between modern workmen and heritage organizations',
      'The blend of modern power tools and prehistoric replica tools',
    ],
    correctIndex: 0,
    explanation:
      'Paragraph 5 explains that previously boats were examined only technologically, but the conference brought together technical papers alongside social, economic, and religious contexts.',
  },
  {
    id: 'r4',
    question: 'In Paragraph 7, what does the pronoun "it" refer to at the end of the sentence?',
    quote:
      '"...a Bronze-Age community straddling the Channel, brought together by the sea, rather than separated by it."',
    paragraphRef: 7,
    options: [
      'The sea (the English Channel)',
      'The Bronze-Age community',
      'The reconstructed boat',
      'Archaeological evidence',
    ],
    correctIndex: 0,
    explanation:
      '"brought together by the sea, rather than separated by it" — "it" refers back to the sea.',
  },
];

export const TRANSFORMATION_TASKS: TransformationTaskItem[] = [
  {
    id: 't1',
    original:
      'The boat was very old and had a big effect on what archaeologists know today.',
    targetGrammar: 'Academic Lexicon & Formal Collocation (Band 8+)',
    prompt:
      'Upgrade the sentence using precise academic vocabulary from Paragraph 1:',
    options: [
      'The prehistoric vessel has exerted a profound influence on modern archaeological research.',
      'The boat was very old and changed a lot of archaeology facts today.',
      'Archaeologists found the boat ancient and it gave big ideas.',
      'Having an old boat made archaeologists learn many things deeply.',
    ],
    correctIndex: 0,
    explanation:
      '"prehistoric vessel", "exerted a profound influence", and "archaeological research" provide high-level academic register.',
  },
  {
    id: 't2',
    original:
      'They wanted to go back and dig for the rest of the boat, but it was too hard and cost too much money.',
    targetGrammar: 'Concessive Clause with Formal Adjective',
    prompt:
      'Upgrade the sentence using the formal style and vocabulary from Paragraph 6:',
    options: [
      'Although returning to search for the unexcavated section was explored, practical and financial hurdles proved insurmountable.',
      'They considered digging more of the boat but money and hardness stopped them.',
      'To dig the missing end was explored, but too many problems were impossible.',
      'Going back to Dover for the boat end had difficulties that could not be surmounting.',
    ],
    correctIndex: 0,
    explanation:
      'Uses "unexcavated section" and "practical and financial hurdles proved insurmountable" with a subordinate concessive structure.',
  },
  {
    id: 't3',
    original:
      'Instead of thinking the sea kept people apart, evidence showed that ancient communities used it to connect with each other.',
    targetGrammar: 'Fronted Contrast with "Rather than"',
    prompt:
      'Upgrade the sentence using the contrastive structure from Paragraph 7:',
    options: [
      'Archaeological findings indicated a maritime community straddling the Channel, brought together by the sea rather than divided by it.',
      'Evidence showed people living across the water and using boats rather than being separated.',
      'Instead of water keeping them away, they straddled the Channel with boats to meet.',
      'The sea was a connector rather than division for communities living there.',
    ],
    correctIndex: 0,
    explanation:
      'Accurately applies "straddling the Channel, brought together by the sea rather than divided by it" in a cohesive academic sentence.',
  },
];
