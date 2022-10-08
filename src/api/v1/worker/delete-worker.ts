import amqp from 'amqplib'
import { rabbitmqConf } from '@config'
import logger from '@api-v1/utils/logger'

type DeleteWorker = {
  doc: 'cart' | 'order'
  filter?: any
  options?: any
}

export const deleteWorker = async (msg: DeleteWorker) => {
  try {
    const connection = await amqp.connect(
      `amqp://${rabbitmqConf.host}:${rabbitmqConf.port}`
    )
    const channel = await connection.createChannel()
    await channel.assertQueue('delete')
    await channel.sendToQueue('delete', Buffer.from(JSON.stringify(msg)))
    setTimeout(() => {
      connection.close()
    }, 1000)
  } catch (error: any) {
    logger.error({ error: error.message }, 'Error delete workder rabbitmq')
  }
}
