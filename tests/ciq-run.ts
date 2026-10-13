/* Uruchamianie skryptów z tests/ciq-scenarios.ts na modelu TypeScript (lib/watch/ciqModel.ts): wynik każdego kroku to plik „złoty” dla Monkey C. */
import { CiqWatchModel } from '@/lib/watch/ciqModel';
import { toCiqWire, CIQ_KEYS, type CiqWireMessage } from '@/lib/watch/ciqWire';
import { SNAPSHOTS, type Step } from './ciq-scenarios';

export type StepResult = { step: Step; msg?: CiqWireMessage; event: CiqWireMessage | null; view: ReturnType<CiqWatchModel['view']> };

export function runScript(steps: Step[], runId = 'w1'): StepResult[] {
  const m = new CiqWatchModel(runId);
  return steps.map(step => {
    let event: CiqWireMessage | null = null; let msg: CiqWireMessage | undefined;
    switch (step.op) {
      case 'snap': { const sc = SNAPSHOTS[step.name]; msg = toCiqWire(sc.snap, { withLabels: !!sc.labels }); if (step.version !== undefined) msg = { ...msg, [CIQ_KEYS.version]: step.version }; m.applySnapshot(msg, step.at); break; }
      case 'hello': event = m.hello(step.at); break;
      case 'press': event = m.press(step.kind, step.at); break;
      case 'undo': event = m.undo(step.at); break;
      case 'tick': event = m.tick(step.at); break;
    }
    return { step, ...(msg ? { msg } : {}), event, view: m.view(step.at) };
  });
}
