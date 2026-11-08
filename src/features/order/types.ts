export type OrderDraft = {
  readonly catalogItemId: string;
  readonly starQuantity: number;
  readonly nickname: string;
  readonly userId: string;
  readonly serverId: string;
  readonly heroOrRoleRequest: string;
  readonly winRateOrStreakRequest: string;
  readonly notes: string;
};

export type OrderFieldErrors = Partial<
  Record<keyof OrderDraft, string>
>;
