var _     = require('lodash');
var brute = require('../api').brute;
var defaultOptions;


// 默认请求次数过多的回调
function failCallback (req, res, next, reset, ip, remainingTime) {
    res.status(429);
    res.send({error: 'too many request, try in ' + remainingTime/1000 + ' seconds later.'});
}

// 返回应等待地时间。时间会根据被屏蔽地次数而累加。
function getWaitingTime (min, max, count) {
    var time = 0;
    time = min * count;
    time = time > max ? max : time;
    return time;
}

//  默认配置
defaultOptions = {
    limitCount  : 1000,          // 限制的请求次数，应和 limitTime 结合来计算是否达到次数过多地条件。

    limitTime   : 60*1000,       // 限制的时间范围。结合 limitCount 则表示在 limitTime 时间内，
                                 // 至多只能请求 limitCount 次，超出则调用 failCallback 函数。

    minWaitTime : 60*1000,      // 最短的等待时间。

    maxWaitTime : 24*60*60*1000, // 最长的等待时间。

    resetTime   : 24*60*60*1000, // 当每个IP第一次触发请求屏蔽时，则会开始记录 resetCountDate，而
                                 // resetTime 则表示从开始记录 resetCountDate 后再过 resetTime 毫秒
                                 // 之后系统自动重置该IP地记录，无论此时此IP是否还在屏蔽状态。

    failCallback: failCallback,  // 屏蔽的具体回调。
};

module.exports = function (options) {
    var ip;
    var now;
    var count;
    var timeGap;
    var firstVisit;
    var failedCount;
    var remainingTime;
    var obj = _.extend({}, defaultOptions, options);
    var reset         = function (clear) {
        // clear 参数表示是否强制重置。强制重置会清除当前IP的失败次数
        if (clear) {
            return brute.update(ip, {
                ip            : ip,
                count         : 0,
                lastVisit     : now,
                firstVisit    : now,
                remainingTime : 0,
                failedCount   : 0,
                resetCountDate: now
            });
        } else {
            return brute.update(ip, {
                ip           : ip,
                count        : 0,
                lastVisit    : now,
                firstVisit   : now,
                remainingTime: 0
            });
        }
    };
    function handleNewIp (ip) {
        return brute.addIp(ip).then(function () {
            return false;
        });
    }
    function handleExistIp (target) {
        count       = target.count + 1;
        firstVisit  = target.firstVisit;
        failedCount = target.failedCount;
        timeGap     = now.getTime() - target.lastVisit.getTime();

        // 判断该IP是否过了重置时间，如果是的话则重置该IP。否则则进入下一个判断环节。
        if (now.getTime() - target.resetCountDate.getTime() > obj.resetTime) {
            return handleExpired();
        } else {
            return handleNotExpired(target);
        }
    }
    function handleExpired () {
        return reset(true).then(function () {return false;});
    }
    function handleNotExpired (target) {
        // 判断当前IP是否仍处于屏蔽状态，是的话则进入屏蔽状态的判断，否则进入正常模式的判断
        if (target.remainingTime > 0) {
            return handleBlock(target);
        } else {
            return handleNormal(target);
        }
    }
    function handleBlock (target) {
        // 对于当前IP来说，即使数据库中存地记录为仍然为屏蔽状态，但是此时有可能已经过了一段时间了，
        // 该IP再次访问时可能已经过了这个屏蔽时间。因此，实际的屏蔽时间应该是之前的屏蔽时间减去
        // 当前时间和上次访问时间的时间差。当屏蔽时间仍然大于0时，则表示该IP仍处于屏蔽状态，调用
        // 屏蔽回调，否则则进入正常访问。
        if (target.remainingTime - timeGap > 0) {
            remainingTime = target.remainingTime - timeGap;
            failedCount   = target.failedCount + 1;
            return brute.update(ip, {ip:ip, count: count, lastVisit: now, remainingTime: remainingTime}).then(function () {
                return true;
            });
        } else {
            return reset().then(function () {return false;});
        }
    }
    function handleNormal (target) {
        // 对于当前IP来说，即使数据库中的屏蔽时间为0，此时也有可能访问次数已经达到了最大限制，因此应先
        // 判断次数。
        // 另外，由于次数地判断是基于一段时间间隔之内的，因此应先判断此时是否仍然在上一的计数时间间隔之内，
        // 若是，则开始判断访问次数是否达到最大限制。反之，则表示开始进入新地时间间隔，此时访问次数则重置为0.
        if (now.getTime() - firstVisit.getTime() < obj.limitTime) {
            if (count < obj.limitCount) {
                return brute.update(ip, {ip: ip, count: count, lastVisit: now, remainingTime: 0}).then(function () {
                    return false;
                });
            } else {
                failedCount   = failedCount + 1;
                remainingTime = target.remainingTime ?
                                    (target.remainingTime - timeGap) :
                                    getWaitingTime(obj.minWaitTime, obj.maxWaitTime, failedCount);
                return brute.update(ip, {
                    ip           : ip,
                    count        : count,
                    lastVisit    : now,
                    failedCount  : failedCount,
                    remainingTime: remainingTime,
                }).then(function () {
                    return true;
                });
            }
        } else {
            return brute.update(ip, {
                ip           : ip,
                count        : 0,
                lastVisit    : now,
                firstVisit   : now,
                remainingTime: 0,
            }).then(function () {
                return false;
            });
        }
    }
    function BruteMiddleware (req, res, next) {
        ip            = req.ip;
        now           = new Date();
        count         = 0;
        remainingTime = 0;
        failedCount   = 0;

        brute.getIp(ip).then(function (result) {
            if (result.total) {
                var target  = result.data[0];
                return handleExistIp(target);
            } else {
                return handleNewIp(ip);
            }
        }).then(function (flag) {
            if (flag) {
                obj.failCallback(req,res, next, reset, ip, remainingTime);
            } else {
                req.brute = {
                    reset: reset,
                    failedCount: failedCount,
                    count: count
                };
                next();
            }
        });
    }

    return BruteMiddleware;
};