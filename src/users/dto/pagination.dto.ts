import { IsOptional, IsInt, Min, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export type PaginationMode = 'offset' | 'cursor';

export class PaginationDto {
    /**
     * Pagination strategy: 'offset' (classic page/limit) or 'cursor' (cursor-based).
     * Defaults to 'offset'.
     */
    @IsOptional()
    @IsIn(['offset', 'cursor'])
    mode?: PaginationMode = 'offset';

    // ── Offset-based ────────────────────────────────────────────────────────────

    /** Current page number (1-indexed). Only used in 'offset' mode. */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    // ── Cursor-based ─────────────────────────────────────────────────────────────

    /**
     * ID of the last item you received. Pass it to get the next page.
     * Only used in 'cursor' mode.
     */
    @IsOptional()
    @Type(() => String)
    @IsString()
    cursor?: string;

    // ── Shared ───────────────────────────────────────────────────────────────────

    /** Number of items per page. Defaults to 1 (for learning). */
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 1;
}
