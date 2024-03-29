import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export default function CommandList() {
  const commands = [
    { command: 'Toggle Bold', windowsLinux: 'Control B', macOS: 'Cmd B' },
    {
      command: 'Toggle Blockquote',
      windowsLinux: 'Control Shift B',
      macOS: 'Cmd Shift B',
    },
    {
      command: 'Toggle Bullet List',
      windowsLinux: 'Control Shift 8',
      macOS: 'Cmd Shift 8',
    },
    {
      command: 'Toggle Code Block',
      windowsLinux: 'Control Alt C',
      macOS: 'Cmd Alt C',
    },
    {
      command: 'Toggle Heading',
      windowsLinux: 'Control Alt 1',
      macOS: 'Cmd Alt 1',
    },
    {
      command: 'Toggle Highlight',
      windowsLinux: 'Control Shift H',
      macOS: 'Cmd Shift H',
    },
    { command: 'Toggle Undo', windowsLinux: 'Control Z', macOS: 'Cmd Z' },
    { command: 'Toggle Redo', windowsLinux: 'Control Y', macOS: 'Cmd Y' },
    { command: 'Toggle Italic', windowsLinux: 'Control I', macOS: 'Cmd I' },
    {
      command: 'Toggle Ordered List',
      windowsLinux: 'Control Shift 7',
      macOS: 'Cmd Shift 7',
    },
    {
      command: 'Toggle Task List',
      windowsLinux: 'Control Shift 9',
      macOS: 'Cmd Shift 9',
    },
    {
      command: 'Toggle Strike',
      windowsLinux: 'Control Shift S',
      macOS: 'Cmd Shift S',
    },
    { command: 'Toggle Underline', windowsLinux: 'Control U', macOS: 'Cmd U' },
  ];

  const sortedCommands = commands.sort((a, b) =>
    a.command.localeCompare(b.command)
  );

  return (
    <Dialog>
      <DialogTrigger className='text-xs text-gray-500 underline hover:text-gray-800'>
        Commands
      </DialogTrigger>
      <DialogContent className='bg-white px-8'>
        <table className='border-collapse table-auto w-full text-sm'>
          <thead>
            <tr>
              <th className='border-b font-medium p-2 pl-8 pt-0 pb-3 text-left'>
                Command
              </th>
              <th className='border-b font-medium p-2 pl-8 pt-0 pb-3 text-left'>
                Windows/Linux
              </th>
              <th className='border-b font-medium p-2 pl-8 pt-0 pb-3 text-left'>
                macOS
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCommands.map(({ command, windowsLinux, macOS }) => (
              <tr key={command}>
                <td className='border-b border-slate-100 p-2 pl-8'>
                  {command}
                </td>
                <td className='border-b border-slate-100 p-2 pl-8'>
                  {windowsLinux}
                </td>
                <td className='border-b border-slate-100 p-2 pl-8'>{macOS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}
