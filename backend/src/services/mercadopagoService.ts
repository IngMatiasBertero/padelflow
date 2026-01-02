import mercadopago from 'mercadopago';

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN || ''
});

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
    const preference = {
      items: [
        {
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
      auto_return: 'approved' as const,
      external_reference: data.turnoId,
      notification_url: `${process.env.FRONTEND_URL?.replace('padelflow', 'api.padelflow')}/api/webhooks/mercadopago`,
      statement_descriptor: 'PADELFLOW'
    };

    const response = await mercadopago.preferences.create(preference);
    return response.body;
  } catch (error) {
    console.error('Error creating MP preference:', error);
    throw error;
  }
};

export const getPaymentInfo = async (paymentId: string) => {
  try {
    const response = await mercadopago.payment.get(parseInt(paymentId));
    return response.body;
  } catch (error) {
    console.error('Error getting payment info:', error);
    throw error;
  }
};
