import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/appContext';

const useCustomRouter = () => {
    const { state, setState } = useAppContext();
    const router = useRouter();
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args) => {
        setState({...state, loading: true});
        originalPush(...args);
    };

    router.replace = (...args) => {
        setState({...state, loading: true});
        originalReplace(...args);
    };

    return router;
};

export default useCustomRouter;
