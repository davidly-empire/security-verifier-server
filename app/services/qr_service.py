from app.database import insert_row, select_rows, update_row, delete_row

TABLE = "qr"


# 🟢 CREATE
def create_qr(data: dict):
    existing = select_rows(TABLE, {"qr_id": data["qr_id"]})
    if existing:
        raise ValueError("QR ID already exists")

    return insert_row(TABLE, data)[0]


# 🔵 READ BY FACTORY
def get_qr_by_factory(factory_code: str):
    return select_rows(TABLE, {"factory_code": factory_code})


# 🔵 READ BY ID
def get_qr_by_id(qr_id: int):
    rows = select_rows(TABLE, {"qr_id": qr_id})
    return rows[0] if rows else None


# 🟡 UPDATE
def update_qr(qr_id: int, data: dict):
    updated = update_row(
        TABLE,
        row_id=qr_id,
        data=data,
        id_column="qr_id"
    )
    return updated[0] if updated else None


# 🔴 DELETE
def delete_qr(qr_id: int):
    deleted = delete_row(
        TABLE,
        row_id=qr_id,
        id_column="qr_id"
    )
    return bool(deleted)
