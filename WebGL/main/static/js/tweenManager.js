import { TWEEN } from '../jsm/libs/tween.module.min.js';
//Tween은 매 프레임 update 호출 기준으로 고려되었기 때문에 현재 프로젝트와는 맞지 않음
// 따라서 Tween을 감싸는 클래스를 만들어 렌더링 필요시에만 update 및 렌더를 호출하도록 만듬
class TweenManger {
    constructor() {
        this.numTweensRunning = 0;
    }
    _handleComplete() {
        --this.numTweensRunning;
        console.assert(this.numTweensRunning >= 0);
    }
    createTween(targetObject) {
        const self = this;
        ++this.numTweensRunning;
        let userCompleteFn = () => {};
        // Tween 인스턴스를 만들고 onCompelete에 콜백 함수를 설치합니다.
        const tween = new TWEEN.Tween(targetObject).onComplete(function(...args) {
            self._handleComplete();
            userCompleteFn.call(this, ...args);
        });
        // Tween 인스턴스의 onComplete 함수를 바꿔 사용자가 콜백 함수를
        // 지정할 수 있도록 합니다.
        tween.onComplete = (fn) => {
            userCompleteFn = fn;
            return tween;
        };
        return tween;
    }
    update() {
        TWEEN.update();
        return this.numTweensRunning > 0;
    }
}

export { TweenManger };