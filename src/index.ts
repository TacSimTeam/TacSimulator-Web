import { SDImgIO } from './sd/sdImgIO';
import { Tac } from './TaC/tac';
import { querySelector } from './util/dom.result';

const canvas = querySelector<HTMLCanvasElement>('#console').unwrap();
const terminal = querySelector<HTMLTextAreaElement>('#terminal').unwrap();

// eslint-disable-next-line
const tac = new Tac(canvas, terminal);

const btnOpen = querySelector<HTMLInputElement>('#btn-openFile').unwrap();

/* 「Open a File」ボタンが押された時の動作 */
btnOpen.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  const file = (target.files as FileList)[0];

  if (file === undefined) {
    // 型情報だけで検知出来ないため必要
    return;
  }

  const sd: SDImgIO = new SDImgIO(file);
  exportMicroSDAPI(sd);

  window.electronAPI
    .openFile(file.name)
    .then(() => {
      console.log(`Filename : ${file.name}`);
    })
    .catch(() => {
      alert('ファイルが正常に読み込まれませんでした');
    });
});

/**
 * TaC内部で使用するAPIを公開する
 *
 * Electron版からソースコードを流用するために
 * window.electronAPIオブジェクトにAPIを公開する
 *
 * @param sd
 * @param fileName
 */
function exportMicroSDAPI(sd: SDImgIO): void {
  window.electronAPI = {
    readSct: async (sctAddr: number) => {
      return await sd.readSct(sctAddr);
    },
    writeSct: async (sctAddr: number, data: Uint8Array) => {
      await sd.writeSct(sctAddr, data);
    },
    openFile: async () => {
      // 無駄にfilenameを渡しているが
      // これはElectron版のwindow.electron.openFile()の
      // インターフェースと合わせるためである(要改善)
      await sd.openFile(sd.getFilename());
    },
    isSDImgLoaded: () => {
      return sd.isLoaded();
    },
    getSDImgPath: async () => {
      return sd.getFilename();
    },
  };
}
