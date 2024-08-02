export const getHotStoresQuery = ({ open, close }) => `
SELECT s.id, s.name, s.address, s.image, o.${open} AS open, o.${close} AS close, sr.avg
FROM store s
JOIN open o ON s.id = o.store_id
JOIN store_rating sr ON s.id = sr.store_id
ORDER BY sr.five DESC
LIMIT 4;
`;
