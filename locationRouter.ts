import express, { Request, Response } from "express";
import { checkAuth } from "../utils/auth";
import { db } from "../db/db";
const locationsRouter = express.Router();

locationsRouter.put(
  "/:locationId",
  checkAuth,
  async (req: Request, res: Response) => {
    const locationId = req.params.locationId;
    const { name, address } = req.body;
    if (name && !address) {
      const updatedLocation = await db.query(
        "UPDATE locations SET name = $1 WHERE id = $2",
        [name, locationId]
      );
    } else if (address && !name) {
      const updatedLocation = await db.query(
        "UPDATE locations SET  address= $1 WHERE id = $2",
        [address, locationId]
      );
    } else if (address && name) {
      const updatedLocation = await db.query(
        "UPDATE locations SET name = $1, address= $2 WHERE id = $3",
        [name, address, locationId]
      );
    } else {
      return res.sendStatus(400);
    }

    res.send({ message: "Updated..." });
  }
);

locationsRouter.post("/", checkAuth, async (req: Request, res: Response) => {
  const { name, address, companyId } = req.body;
  const isValid = name && address && companyId;
  if (!isValid) return res.send(400);
  await db.query(
    "insert into locations (name, address, companies_id) values($1, $2, $3)",
    [name, address, companyId]
  );
  res.send(200);
});

locationsRouter.delete(
  "/:locationId",
  checkAuth,
  async (req: Request, res: Response) => {
    const locationId = req.params.locationId;
    if (!locationId) return res.sendStatus(400);
    try {
      await db.query("delete from locations where id = $1", [locationId]);
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  }
);

export default locationsRouter;
