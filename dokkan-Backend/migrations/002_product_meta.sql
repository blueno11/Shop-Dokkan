-- Meta JSON for products (e.g., rank, stones, lrs, features)
CREATE TABLE IF NOT EXISTS product_meta (
  product_id INT PRIMARY KEY,
  meta_json JSON NOT NULL,
  CONSTRAINT fk_meta_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


