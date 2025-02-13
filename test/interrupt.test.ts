import { IntrController } from '../src/renderer/TaC/interrupt/intrController';
import * as intr from '../src/renderer/TaC/interrupt/interruptKind';

test('Interrupt test', () => {
  const intrController = new IntrController();

  intrController.interrupt(intr.TIMER0);
  expect(intrController.isExceptionOccurred()).toBe(false);
  expect(intrController.checkIntrNum()).toBe(intr.TIMER0);
  expect(intrController.checkIntrNum()).toBe(null);

  intrController.interrupt(intr.EXCP_MEMORY_ERROR);
  expect(intrController.isExceptionOccurred()).toBe(true);
  expect(intrController.checkIntrNum()).toBe(intr.EXCP_MEMORY_ERROR);
  expect(intrController.checkIntrNum()).toBe(null);
  expect(intrController.isExceptionOccurred()).toBe(false);

  /* 例外は割込みより優先される */
  intrController.interrupt(intr.MICRO_SD);
  intrController.interrupt(intr.EXCP_ZERO_DIV);
  expect(intrController.isExceptionOccurred()).toBe(true);
  expect(intrController.checkIntrNum()).toBe(intr.EXCP_ZERO_DIV);
  expect(intrController.isExceptionOccurred()).toBe(false);
  expect(intrController.checkIntrNum()).toBe(intr.MICRO_SD);
  expect(intrController.checkIntrNum()).toBe(null);
});
