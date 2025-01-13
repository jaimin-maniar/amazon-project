import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'

export const deliverOptions = [{
    id: '1',
    deliveryDays: 7,
    priceCents: 0
}, {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
}, {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
}]

export function calculateDeliveryDate(deliverOption) {
    const today = dayjs();
    let deliveryDate = today.add(deliverOption.deliveryDays, 'days');
    const dayOfWeek = deliveryDate.format('dddd');
    if (dayOfWeek === 'Saturday') {
        deliveryDate = today.add(deliverOption.deliveryDays + 2, 'days');
    } else if (dayOfWeek === 'Sunday') {
        deliveryDate = today.add(deliverOption.deliveryDays + 1, 'days');
    }
    return deliveryDate.format('dddd, MMMM D')
}
