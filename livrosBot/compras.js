const env = require('../.env')
const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const Session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const { markup } = require('telegraf/extra')


let livro = ''
let preco = 0
let data = null

const bot = new Telegraf(env.token)

const confirmacao = Extra.markup(
    Markup.inlineKeyboard([
        Markup.callbackButton(`Sim`,`s`),
        Markup.callbackButton(`Não`,`n`)
    ])
)


const precoHandler = new Composer()
precoHandler.hears(/(\d+)/, ctx => {
    preco = ctx.match[1]
    ctx.reply(`Data de pagamento:`)
    ctx.wizard.next()
})

precoHandler.use(ctx => ctx.reply(`Apenas números são aceitos!`))

const dataHandler = new Composer()
dataHandler.hears(/(\d{2}\/\d{2}\/\d{4})/, ctx => {
    data = ctx.match[1]
    ctx.reply(
        `Compra: 
        Livro: ${livro}
        Data: ${data}
        Preço: ${preco}
        Confirmar compra?`,confirmacao
    )
    ctx.wizard.next()
})

dataHandler.use(ctx => ctx.reply(`Entre com uma data no seguinte formato: dd/mm/aaaa`))

const confirmacaoHandler = new Composer()

confirmacaoHandler.action('s', ctx => {
    ctx.reply(`Compra confirmada!`)
    ctx.scene.leave()
})
confirmacaoHandler.action('n', ctx => {
    ctx.reply(`Compra cancelada!`)
    ctx.scene.leave()
})


confirmacaoHandler.use(ctx => ctx.reply(
    `Apenas confirme!`,
    confirmacao)
)

const wizardCompra = new WizardScene('compra', 
    ctx => {
        ctx.reply(`Informe o nome do livro`)
        ctx.wizard.next()
    },
    ctx => {
        livro = ctx.update.message.text
        ctx.reply(`Preço?`)
        ctx.wizard.next()
    },
    precoHandler,
    dataHandler,
    confirmacaoHandler
)

const stage1 = new Stage([wizardCompra], { default: 'compra' })
bot.use(Session())
bot.use(stage1.middleware())

bot.startPolling()
