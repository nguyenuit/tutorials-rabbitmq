const amqplib = require('amqplib')

const amqp_url_cloud = 'amqps://zckikibk:wb2U_HzitlYu4dnk92C6TWSbSUN4hgew@armadillo.rmq.cloudamqp.com/zckikibk'
//const amqp_url_docker = 'amqp://localhost:5672'

const receiveMail = async () => {
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

        //4. create queue
        const { queue } = await channel.assertQueue('',{
            exclusive: true
        })
        
        //5. binding
        const agrs = process.argv.slice(2)
        if (!agrs.length){
            process.exit(0)
        }

        /*
            * co nghia la phu hop voi bat ky tu nao
            # khop voi mot hoac nhieu tu bat ky
        */
        
        console.log(`waitting queue ::${queue}:::topic:::${agrs}`)

        agrs.forEach( async key => {
            console.log('debug key', key)
            await channel.bindQueue(queue, exChangeName, key)
        })

        await channel.consume(queue, msg => {
            console.log(`Routing key: ${msg.fields.routingKey}:::msg:::${msg.content.toString()}`)
        })

    } catch (error) {
        console.log(error.message)
    }
}

receiveMail()
