/** Controladores de solo lectura para formadores y notificaciones. */
import type { Request, Response } from "express";
import { formadorRepository } from "../repositories/formadorRepository.js";
import { notificacionService } from "../services/notificacionService.js";
import type { RolNotificacion } from "../types/domain.js";

export const formadorController = {
  listar(_req: Request, res: Response): void {
    res.json(formadorRepository.findAll());
  },
};

export const notificacionController = {
  listar(req: Request, res: Response): void {
    const { tipo, id } = req.query;
    if (typeof tipo === "string" && typeof id === "string") {
      res.json(notificacionService.listar(tipo as RolNotificacion, id));
      return;
    }
    // Sin filtro: todas (equivale a `db.notifs` del front original).
    res.json(notificacionService.listarTodas());
  },
  marcarLeida(req: Request, res: Response): void {
    notificacionService.marcarLeida(req.params.id);
    res.status(204).end();
  },
};
