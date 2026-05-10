import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Search, XIcon } from 'lucide-react';

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
	width?: number;
}

function SearchInput({ value, onChange, disabled, placeholder = 'Search...', width = 300 }: SearchInputProps) {
	return (
		<TextField
			disabled={disabled}
			placeholder={placeholder}
			variant="outlined"
			size="small"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			sx={{ width, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
			slotProps={{
				input: {
					startAdornment: (
						<InputAdornment position="start">
							<Search size={20} />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							{value && (
								<IconButton sx={{ border: 0, p: 1, mr: -1.5 }} onClick={() => onChange('')}>
									<XIcon size={20} />
								</IconButton>
							)}
						</InputAdornment>
					),
				},
			}}
		/>
	);
}

export default SearchInput;
