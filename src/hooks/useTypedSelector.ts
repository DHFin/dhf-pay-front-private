import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../store/store';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useTypedSelector };
