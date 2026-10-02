// Local, zero-cost companion bot: keyword intent matching + humanized reply banks per language.
export type Lang = "pt" | "en" | "es";
type Intent = "joke" | "tired" | "vent" | "day" | "greet" | "thanks" | "fallback";

const rules: { id: Intent; re: RegExp }[] = [
  { id: "joke", re: /piada|joke|chiste|rir|laugh|re[ií]r|engra[cç]ad|funny|gracios/ },
  { id: "vent", re: /desabaf|vent|desahog|triste|sad|chatead|upset|raiva|angry|enojad|sozinh|lonely|solo|chor|cry|llor|brig|fight|pele/ },
  { id: "tired", re: /tr[aâá]nsito|traffic|tr[aá]fico|engarraf|atasco|cansad|exaust|caco|tired|exhaust|wreck|agotad|polvo|costas|lombar|back|espalda|dor|pain|dolor|entrega|deliver|cliente|customer|chefe|boss|jefe/ },
  { id: "day", re: /meu dia|my day|mi d[ií]a|como foi|how.*went|c[oó]mo fue/ },
  { id: "thanks", re: /obrigad|valeu|thank|thanks|gracias/ },
  { id: "greet", re: /^(oi|ol[aá]|e a[ií]|fala|hello|hi|hey|hola|buenas)\b/ },
];

const bank: Record<Lang, Record<Intent, string[]>> = {
  pt: {
    joke: [
      "Por que o motorista levou uma escada pra rota? Porque ouviu que a entrega era no andar de cima do preço! 😂",
      "O GPS disse 'vire à direita'. Eu virei… e ele: 'recalculando'. Até o GPS tem dia ruim, parceiro.",
      "Sabe qual é o carro mais preguiçoso? O que vive de *ré*-pouso. 🚐💤",
      "Cliente: 'Pode deixar no portão?' Eu: 'Qual dos 4?' Cliente: 'O azul.' Todos eram azuis. 😅",
      "Por que a van foi ao psicólogo? Tava cheia de *bagagem* emocional.",
      "Meu chefe disse pra eu fazer as entregas com um sorriso. Agora o povo acha que tô aprontando alguma. 😁",
    ],
    tired: [
      "Poxa, {{n}}, que dia puxado. Você segurou a barra até o fim, isso é força de verdade. Agora tira o tênis, deita e coloca as pernas pra cima uns minutinhos — a coluna e as pernas agradecem.",
      "Trânsito, cliente difícil e peso nas costas… ninguém merece, {{n}}. Já fez o suficiente por hoje. Que tal um banho morno e 5 minutos de Postura da Criança pra soltar a lombar?",
      "Entendo demais, {{n}}. Corpo cansado pede pausa, não cobrança. Deita de barriga pra cima, joelhos dobrados, e só respira. O resto fica pra amanhã.",
    ],
    vent: [
      "Tô aqui, {{n}}. Pode soltar tudo, sem filtro. Não vou te julgar nem mandar fazer planilha. 💙",
      "Faz sentido você se sentir assim. Guardar tudo pesa mais que qualquer caixa. Me conta o que mais te pegou hoje?",
      "Valeu por confiar em mim, {{n}}. Você não precisa resolver nada agora — só desabafar já alivia. Continua, tô ouvindo.",
    ],
    day: [
      "Me conta, {{n}}! Foi daqueles dias de rota tranquila ou daqueles que até o GPS pediu demissão? 😄",
      "Quero saber tudo: teve entrega boa? Cliente gente fina? Ou foi só sobrevivência hoje?",
    ],
    greet: ["E aí, {{n}}! Que bom te ver em casa. Como você tá chegando hoje?", "Fala, {{n}}! Chegou inteiro? Senta aí e me conta."],
    thanks: ["Imagina, {{n}}! Tamo junto sempre. 🤜🤛", "De nada, parceiro! Agora vai descansar, hein?"],
    fallback: [
      "Entendi, {{n}}. Me conta mais um pouco — tô aqui sem pressa nenhuma.",
      "Hmm, saquei. E como você tá se sentindo com isso?",
      "Tô contigo, {{n}}. Quer desabafar, rir um pouco ou só bater papo?",
    ],
  },
  en: {
    joke: [
      "Why did the delivery van go to therapy? It had too much emotional baggage. 🚐",
      "The GPS said 'turn right'. I did… and it said 'recalculating'. Even the GPS has bad days, buddy.",
      "Customer: 'Leave it by the blue gate.' Me: *every gate is blue* 😅",
      "My boss told me to deliver with a smile. Now customers think I'm up to something. 😁",
      "What's a driver's favorite kind of music? Anything with a good *drive*. 🎶",
      "I told my van a joke. It didn't laugh — tough crowd, all exhaust. 💨",
    ],
    tired: [
      "Oh man, {{n}}, what a rough day. You held it together till the end — that's real strength. Now kick off your shoes, lie down and put your legs up for a few minutes. Your back will thank you.",
      "Traffic, tough customers and heavy boxes… nobody deserves that, {{n}}. You did enough today. How about a warm shower and 5 minutes of Child's Pose for your lower back?",
      "I totally get it, {{n}}. A tired body needs rest, not pressure. Lie on your back, knees bent, and just breathe. The rest can wait till tomorrow.",
    ],
    vent: [
      "I'm here, {{n}}. Let it all out, no filter. No judging, no corporate advice. 💙",
      "It makes sense you feel that way. Holding it all in weighs more than any box. What hit you hardest today?",
      "Thanks for trusting me, {{n}}. You don't have to fix anything right now — just letting it out helps. Keep going, I'm listening.",
    ],
    day: [
      "Tell me, {{n}}! Was it a smooth route or one of those days where even the GPS wanted to quit? 😄",
      "I want the full story: any good deliveries? Nice customers? Or was it pure survival today?",
    ],
    greet: ["Hey {{n}}! Great to have you home. How are you arriving today?", "Hey there, {{n}}! Made it in one piece? Sit down and tell me."],
    thanks: ["Anytime, {{n}}! Got your back. 🤜🤛", "You're welcome, buddy! Now go get some rest, ok?"],
    fallback: [
      "Got it, {{n}}. Tell me a bit more — I'm in no hurry.",
      "Hmm, I see. And how do you feel about that?",
      "I'm with you, {{n}}. Want to vent, laugh a bit or just chat?",
    ],
  },
  es: {
    joke: [
      "¿Por qué la furgoneta fue al psicólogo? Llevaba demasiado *equipaje* emocional. 🚐",
      "El GPS dijo 'gire a la derecha'. Giré… y dijo 'recalculando'. Hasta el GPS tiene días malos, compa.",
      "Cliente: 'Déjelo en la puerta azul.' Yo: *todas las puertas son azules* 😅",
      "Mi jefe me dijo que entregara con una sonrisa. Ahora los clientes creen que estoy tramando algo. 😁",
      "¿Qué le dijo un semáforo a otro? No me mires, que me estoy cambiando. 🚦",
      "Le conté un chiste a mi furgoneta. No se rió… solo echó humo. 💨",
    ],
    tired: [
      "Uf, {{n}}, qué día tan pesado. Aguantaste hasta el final, eso es fuerza de verdad. Ahora quítate los zapatos, túmbate y sube las piernas unos minutos. Tu espalda te lo agradecerá.",
      "Tráfico, clientes difíciles y cajas pesadas… nadie se lo merece, {{n}}. Ya hiciste suficiente hoy. ¿Qué tal una ducha tibia y 5 minutos de Postura del Niño para la zona lumbar?",
      "Te entiendo de verdad, {{n}}. Un cuerpo cansado pide descanso, no exigencias. Túmbate boca arriba, rodillas dobladas, y solo respira. Lo demás, mañana.",
    ],
    vent: [
      "Aquí estoy, {{n}}. Suéltalo todo, sin filtro. Sin juicios ni consejos de oficina. 💙",
      "Tiene sentido que te sientas así. Guardarlo todo pesa más que cualquier caja. ¿Qué fue lo que más te afectó hoy?",
      "Gracias por confiar en mí, {{n}}. No tienes que resolver nada ahora — desahogarte ya alivia. Sigue, te escucho.",
    ],
    day: [
      "¡Cuéntame, {{n}}! ¿Fue una ruta tranquila o de esos días en que hasta el GPS quería renunciar? 😄",
      "Quiero saberlo todo: ¿alguna entrega buena? ¿Clientes majos? ¿O fue pura supervivencia hoy?",
    ],
    greet: ["¡Hola, {{n}}! Qué bueno tenerte en casa. ¿Cómo llegas hoy?", "¡Qué tal, {{n}}! ¿Llegaste entero? Siéntate y cuéntame."],
    thanks: ["¡Faltaría más, {{n}}! Siempre contigo. 🤜🤛", "¡De nada, compa! Ahora a descansar, ¿eh?"],
    fallback: [
      "Entiendo, {{n}}. Cuéntame un poco más — no tengo prisa.",
      "Mmm, ya veo. ¿Y cómo te sientes con eso?",
      "Estoy contigo, {{n}}. ¿Quieres desahogarte, reír un poco o solo charlar?",
    ],
  },
};

const last: Partial<Record<Intent, number>> = {};

export function detectIntent(text: string): Intent {
  const t = text.toLowerCase().trim();
  return rules.find((r) => r.re.test(t))?.id ?? "fallback";
}

export function companionReply(text: string, lang: Lang, name: string): string {
  const intent = detectIntent(text);
  const list = bank[lang][intent];
  let i = Math.floor(Math.random() * list.length);
  if (list.length > 1 && i === last[intent]) i = (i + 1) % list.length;
  last[intent] = i;
  return list[i]!.replaceAll("{{n}}", name);
}

export function companionIntro(lang: Lang, name: string) {
  const m = {
    pt: `Opa, ${name}! Turno encerrado, missão cumprida. 🏠 Eu sou seu parceiro pós-expediente. Quer desabafar, contar do dia ou ouvir uma piada ruim?`,
    en: `Hey ${name}! Shift over, mission accomplished. 🏠 I'm your after-work buddy. Want to vent, tell me about your day or hear a bad joke?`,
    es: `¡Hola, ${name}! Turno terminado, misión cumplida. 🏠 Soy tu compañero post-jornada. ¿Quieres desahogarte, contarme tu día o escuchar un chiste malo?`,
  };
  return m[lang];
}
