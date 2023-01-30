const SECTOR_SIZE = 512;

export class SDImgIO {
  private file: File;
  private buf: Uint8Array | null;

  constructor(file: File) {
    this.file = file;
    this.buf = null;
  }

  async readSct(sctAddr: number): Promise<Uint8Array> {
    if (this.buf === null) {
      throw new Error('イメージファイルをオープンしていません');
    }

    return this.buf.slice(sctAddr * SECTOR_SIZE, (sctAddr + 1) * SECTOR_SIZE);
  }

  async writeSct(sctAddr: number, data: Uint8Array): Promise<void> {
    if (this.buf === null) {
      throw new Error('イメージファイルをオープンしていません');
    }

    for (let i = 0; i < SECTOR_SIZE; i++) {
      this.buf[sctAddr * SECTOR_SIZE + i] = data[i];
    }
  }

  async openFile(filePath: string): Promise<void> {
    if (filePath.toUpperCase().match(/\.(DMG)$/i) === null) {
      throw new Error(`".dmg"ファイルのみ読み込み可能です : ${filePath}`);
    }

    const buf = await this.file.arrayBuffer();
    this.buf = new Uint8Array(buf);
  }

  isLoaded(): boolean {
    return this.buf !== null;
  }

  getFilename(): string {
    return this.file.name;
  }
}
