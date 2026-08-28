ALTER TABLE payments ADD CONSTRAINT payments_status_check CHECK(status IN ('PENDING','PAID','FAILED','REFUNDED'));
ALTER TABLE payments ADD CONSTRAINT payments_amount_check CHECK(amount >= 0);
ALTER TABLE inventory_reservations ADD CONSTRAINT inventory_reservation_status_check CHECK(status IN ('RESERVED','CONSUMED','RELEASED'));
ALTER TABLE inventory_reservations ADD CONSTRAINT inventory_reservation_quantity_check CHECK(quantity > 0);
