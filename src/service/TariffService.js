export class TariffService {
    getTariff() {
        return fetch('/data/tariff.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
    getTariffForMedico() {
        return fetch('/data/tariffForMedico.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
