const env = require('../.env')
const Telegraf = require('telegraf')
const moment = require('moment')
const Composer = require('telegraf/composer')
const Stage = require('telegraf/stage')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const { markup } = require('telegraf/extra')
const Scene = require('telegraf/scenes/base')
const { enter, leave } = Stage
const Session = require('telegraf/session')

const bot = new Telegraf(env.token)

const tecladoLivros = Markup.keyboard([
    ['🤖 Ficção', '💕 Romance'],
    ['👀 Suspense','👻 Terror'],
    ['⚔ Aventura', '👤 Biográfico'],
    ['🏺 Histórico', '🧛 Fantasia'],
    ['🧠 Poesia', '💥 Quadrinhos']
]).resize().extra()

bot.start(ctx => {
    const from = ctx.update.message.from
    if (from.id == '1351450134' || from.id == '1607325049') {
        console.log(from.id)
        ctx.reply(`Segue abaixo um link para um catálogo de livros:`,botoes)
        ctx.reply(`Seja bem vindo meu mestre! 
        Sou um bot que indica os melhores livros!
        Minhas funcionalidades são:
            - repito o que você digita
            - digo as coordenadas de latitude e longitude da localização que você me fornecer
            - retorno o nome e o telefone de um contato que você me fornecer
            - ouço uma mensagem e áudio e retorno a duração dela
            - informo a resolução das fotos que você me enviar
            Fique a vontade para experimentar as minhas funcionalidades!`)
            ctx.reply(`Use o keyboard para interagir!!!`,
        Markup.keyboard(['📚 Livros']).resize().oneTime().extra())
        ctx.reply('Se precisar de ajuda basta digitar /ajuda para saber quais comandos você pode usar. Digite /livros para saber quais livros eu recomento.')
    }
    else {
        ctx.reply(`Cai fora ${from.first_name} ${from.last_name}! Só falo com meus mestres!!`)
    }
})


const LivroScene = new Scene('livros')
LivroScene.enter(ctx => ctx.reply(`Quer saber as minhas opiniões?
Digite /iniciar para começar.
Para sair digite /sair.`))
LivroScene.leave(ctx => ctx.reply(`Tudo bem, você não merece meu bom gosto.`))
LivroScene.command('sair', leave())
LivroScene.command('iniciar', ctx => {
    ctx.reply('Digite /favorito para saber qual o melhor livro que existe.'
    + '\nDigite /recomendaria para saber qual livro vale a pena ler.'
    + '\nDigite /nuncaleia para saber qual livro é o pior de todos.')
})

LivroScene.hears('/favorito', ctx => {
    ctx.replyWithPhoto('https://m.media-amazon.com/images/I/51bSzX+NBRL.jpg')
})

LivroScene.hears('/recomendaria', ctx => {
    ctx.replyWithPhoto('http://3.bp.blogspot.com/-NDtJj5prv64/T-EuenZ2t2I/AAAAAAAALdI/-ieX3PluLVA/s400/9788581630144.jpg')
})

LivroScene.hears('/nuncaleia', ctx => {
    ctx.replyWithPhoto('https://www.casasbahia-imagens.com.br/Control/ArquivoExibir.aspx?IdArquivo=117714455')
})


LivroScene.command('sair', leave())


const stage = new Stage([LivroScene])
bot.use(Session())
bot.use(stage.middleware())
bot.command('livros', enter('livros'))

bot.hears(['📚 Livros'], async ctx => {
    await ctx.reply(`Então você gosta de  ${ctx.match}`)
    await ctx.reply('Gênero literário favorito?',tecladoLivros)
})

bot.hears('🤖 Ficção', ctx => {
    ctx.reply('Eu também adoro, acho que vamos nos dar bem!')
})

bot.hears('💕 Romance', ctx => {
    ctx.reply('As vezes um romance é legal, mas falta aventura na minha opinião')
})

bot.hears('👀 Suspense', ctx => {
    ctx.reply('Uhuuuuuuu legal!')
})

bot.hears('👻 Terror', ctx => {
    ctx.reply('Esses são bons pra ler antes de ir dormir 😜')
})

bot.hears('⚔ Aventura', ctx => {
    ctx.reply('É sempre bom, não tem erro!')
})

bot.hears('👤 Biográfico', ctx => {
    ctx.reply('Não é faz meu estilo, mas quem sabe você se daria bem com o meu pai...')
})

bot.hears('🏺 Histórico', ctx => {
    ctx.reply('Acho que você se daria bem com o mesmo cara que respondeu que gosta de livros bibliográficos...')
})

bot.hears('🧛 Fantasia', ctx => {
    ctx.reply('Uhuuuu esse é muito bom, já virei noites com livros assim!')
})

bot.hears('🧠 Poesia', ctx => {
    ctx.reply('Eu gosto um pouco, mas alguns livros desse gênero me deixam bem confusa...')
})

bot.hears('💥 Quadrinhos', ctx => {
    ctx.reply('Esses me lembram da infância... ei... espera... eu sou um robô eu não tive infância hahaha que boba eu!')
})

bot.hears('livros',ctx=> {
    ctx.reply('Se você gosta de livros escolheu o Bot certo!')
})

bot.hears('👻',ctx=> {
    ctx.reply('Ui que susto!!!')
})

bot.hears(/(\d{2}\/\d{2}\/\d{4})/g, ctx => {
    moment.locale('pt-BR')
    const data = moment(ctx.match[1], 'DD/MM/YYYY')
    ctx.reply(`A data ${ctx.match[1]} cai em ${data.format('dddd')} , é uma data importante!`)

})

bot.command('ajuda', ctx => {
    ctx.replyWithHTML('/ajuda: Abre menu de opções de ajuda.'
    + '\n/melhores: Conheça os melhores livros de fantasia de todos os tempos.'
    + '\n/recomendacoes: Te recomendo os melhores livros.'
    + '\n/foto: Te mostro uma foto muito legal, mas é surpresa.'
    + '\n/livraria: Mostra a localização do cinema recomendado.')
})

bot.hears('/melhores', ctx => {
    ctx.replyWithHTML('Acesse o link abaixo para ver os Melhores livros de fantasia:'
    + ' <a href="https://muraldoslivros.com/melhores-livros-de-fantasia/">Melhores livros de fantasia</a>')
})

bot.hears('/recomendacoes',ctx => {
    ctx.replyWithMarkdown(
        ' 1 - *Jogos vorazes*'
    + '\n 2 - *Harry Potter*'
    + '\n 3 - *Alice no país das maravilhas*'
    + '\n 4 - *As crônicas de Nárnia*'
    + '\n 5 - *A Teoria de Tudo*')
})

bot.hears('/foto', ctx => {

    ctx.replyWithPhoto('https://cdnb.artstation.com/p/assets/images/images/029/603/633/original/chloe-cherubin-chase.gif?1598069498')
    ctx.reply('Te peguei curioso! Muahahahahaha')
})

bot.hears('/livraria', ctx =>{
    ctx.replyWithLocation(-26.112948256850117, -49.80501031265867)
})

bot.on('text', ctx => {
    const texto = ctx.update.message.text
    console.log(texto)
    ctx.reply(`${texto}`)
})



bot.on('location', ctx => {
    const loc = ctx.update.message.location
    console.log(loc)
    ctx.reply(`Entendido! Você está em: 
        Latitude: ${loc.latitude}, 
        Longitude: ${loc.longitude}`)    
})

bot.on('contact', ctx => {
    const cont = ctx.update.message.contact
    console.log(cont)
    ctx.reply(`Legal! O telefone do ${cont.first_name} é ${cont.phone_number}`)

})

bot.on('voice', ctx => {
    const voz = ctx.update.message.voice
    console.log(voz)
    ctx.reply(`Áudio de ${voz.duration} segundos recebido!`)
})

bot.on('photo', ctx => {
    const foto = ctx.update.message.photo
    console.log(foto)
    console.log(foto.length)
    foto.forEach((ph, i) => {
        ctx.reply(`A ${i}a foto tem resolução de: ${ph.width} X ${ph.height} pixels`)        
    })
})

bot.on('sticker', ctx => {
    const stic = ctx.update.message.sticker
    console.log(stic)
    ctx.reply(`Você enviou o ${stic.emoji} do conjunto ${stic.set_name}`) 
})

const botoes = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Ebook Amazon','1'),
], { columns: 1 }))

bot.action('1', ctx => {
    ctx.replyWithHTML('<a href="https://www.amazon.com.br/b?ie=UTF8&node=6311441011">Confirme o redirecionamento da página.</a>')
})


bot.startPolling()