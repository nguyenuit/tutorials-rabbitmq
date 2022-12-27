const amqplib = require('amqplib')

const amqp_url_cloud = 'amqps://zckikibk:wb2U_HzitlYu4dnk92C6TWSbSUN4hgew@armadillo.rmq.cloudamqp.com/zckikibk'
//const amqp_url_docker = 'amqp://localhost:5672'

const sendMail = async () => {
    try {
        //1. create connection
        const conn = await amqplib.connect(amqp_url_cloud)

        //2. create channel
        const channel = await conn.createChannel()

        //3. create exchange
        const exChangeName = 'send_mail'

        await channel.assertExchange(exChangeName, 'topic', {
            durable: false
        })

        const agrs = process.argv.slice(2)
        const msg = agrs[1] || 'Fixed!'
        const topic = agrs[0]

        console.log(`msg::${msg}:::topic:::${topic}`)

        //4. publish mail
        await channel.publish(exChangeName, topic, Buffer.from(msg))

        console.log(`[x] Send OK:::${msg}`)

        setTimeout(function(){
            conn.close()
            process.exit(0)
        }, 10000)    
    } catch (error) {
        console.log(error.message)
    }
}

sendMail()
