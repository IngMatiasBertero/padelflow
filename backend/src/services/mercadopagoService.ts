import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// Configurar cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
});

const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

export interface CreatePreferenceData {
  title: string;
  description: string;
  price: number;
  quantity: number;
  turnoId: string;
  clienteEmail: string;
  clienteNombre: string;
}

export const createPreference = async (data: CreatePreferenceData) => {
  try {
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: data.turnoId,
            title: data.title,
            description: data.description,
            unit_price: data.price,
            quantity: data.quantity,
            currency_id: 'ARS'
          }
        ],
        payer: {
          name: data.clienteNombre,
          email: data.clienteEmail
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/reservas/exito`,
          failure: `${process.env.FRONTEND_URL}/reservas/error`,
          pending: `${process.env.FRONTEND_URL}/reservas/pendiente`
        },
        auto_return: 'approved',
        external_reference: data.turnoId,
        notification_url: `${process.env.FRONTEND_URL?.replace('padelflow', 'api.padelflow')}/api/pagos/webhooks/mercadopago`,
        statement_descriptor: 'PADELFLOW'
      }
    });

    return preference;
  } catch (error) {
    console.error('Error creating MP preference:', error);
    throw error;
  }
};

export const getPaymentInfo = async (paymentId: number) => {
  try {
    const payment = await paymentClient.get({ id: paymentId });
    return payment;
  } catch (error) {
    console.error('Error getting payment info:', error);
    throw error;
  }
};
