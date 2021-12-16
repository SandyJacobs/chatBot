const env = require('../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const bot = new Telegraf(env.token)

let dados = {}

const gerarBotoes = lista => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(
            item => Markup.callbackButton(
                item, `delete ${item}`
            )
        ),
        { columns: 4 }
    )
)

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo, ${name}!`)
    await ctx.reply(`No MyBookList você cria uma lista com seus livros favoritos!`)
})

bot.use((ctx,next) => {
    const chatId = ctx.chat.id
    if (!dados.hasOwnProperty(chatId))
        dados[chatId] = []
    ctx.itens = dados[chatId]
    next()
})

bot.on('text', ctx => {
    let texto = ctx.update.message.text
    if(texto.startsWith('/'))
        texto = texto.substring(1)
    ctx.itens.push(texto)
    ctx.reply(
        `${texto} adicionado.`, 
        gerarBotoes(ctx.itens)
    )
})

bot.action(/delete (.+)/, ctx => {
    const indice = ctx.itens.indexOf(ctx.match[1])
    if (indice >= 0)
        ctx.itens.splice(indice,1)
    ctx.reply(
        `${ctx.match[1]} removido da lista`,
        gerarBotoes(ctx.itens)
    )
})

bot.startPolling()