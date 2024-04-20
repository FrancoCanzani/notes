import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

export default function Shortcuts() {
  const shortcuts = [
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

  const sortedCommands = shortcuts.sort((a, b) =>
    a.command.localeCompare(b.command)
  );

  return (
    <Dialog>
      <DialogTrigger className='text-gray-500 text-xs underline hover:text-gray-800'>
        Commands
      </DialogTrigger>
      <DialogContent className='bg-white rounded-sm'>
        <div className='relative overflow-x-auto pt-6'>
          <table className='w-full text-sm text-left rtl:text-right'>
            <thead className='text-xs bg-gray-50 rounded-sm'>
              <tr>
                <th scope='col' className='px-2 sm:px-4 md:px-6 py-2'>
                  Command
                </th>
                <th scope='col' className='px-2 sm:px-4 md:px-6 py-2'>
                  Windows/Linux
                </th>
                <th scope='col' className='px-2 sm:px-4 md:px-6 py-2'>
                  macOS
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCommands.map(({ command, windowsLinux, macOS }) => (
                <tr key={command} className='text-xs '>
                  <th
                    scope='row'
                    className='px-2 sm:px-4 md:px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                  >
                    {command}
                  </th>
                  <td className='px-2 sm:px-4 md:px-6 py-2'>{windowsLinux}</td>
                  <td className='px-2 sm:px-4 md:px-6 py-2'>{macOS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
