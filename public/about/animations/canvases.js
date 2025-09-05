$(document).ready(function(){
    rvv_fc_c = new PrairieDrawAnim("rvv-fc-c", function(t) {
        this.setUnits(8, 4);
    
            this.addOption("otherLength", false);
            this.addOption("otherDir", false);
    
            var O1 = $V([1.96 * Math.sin(1.6 * t - 0.7), 0.97 * Math.cos(0.9 * t + 1)]);
            var O2 = $V([2.4 * Math.sin(t + 1), 0.94 * Math.cos(0.6 * t + 2)]);
            var V1 = $V([1.5, 0.7]);
            var V2 = $V([1.5, 0.7]);
    
            var sameVecs = true;
    
            if (this.getOption("otherDir")) {
                sameVecs = false;
                V1 = V1.rotate(-Math.PI/6, $V([0, 0]));
                V2 = V2.rotate(Math.PI/6, $V([0, 0]));
            }
            if (this.getOption("otherLength")) {
                sameVecs = false;
                V1 = V1.x(1.4);
                V2 = V2.x(0.8);
            }
            this.translate($V([-0.9, -0.3]));
            this.arrow(O1, O1.add(V1), "position");
            this.labelLine(O1, O1.add(V1), $V([0, 1]), "TEX:$\\vec{a}$");
            this.arrow(O2, O2.add(V2), "angMom");
            this.labelLine(O2, O2.add(V2), $V([0, -1]), "TEX:$\\vec{b}$");
            
            var msg;
            if (sameVecs) {
                msg = "TEX:\\vec{a} \\text{ is the same as } $\\vec{b}$";
            } else {
                msg = "TEX:\\vec{a} \\text{ is different to } \\vec{b}$";
            }
            var T = this.posNm2Dw($V([0.5, 0]));
            this.text(T, $V([0, -1]), msg);
        });
    rvc_fm_c = new PrairieDrawAnim("rvc-fm-c", function(t) {
        this.setUnits(12, 6);

        this.addOption("showLabels", true);
        this.addOption("showVelocity", false);
        this.addOption("showVelocityDecomp", false);

        var O = $V([0, 0]);

        var f = function(t) {
            var m = 2;
            var length = m * (2 + Math.sin(1.3 * t)) / 3;
            var angle = 0.3 * t + Math.sin(t);
            return {
                a: this.polarToRect($V([length, angle])),
            };
        }.bind(this);

        var val = this.numDiff(f, t);

        var a = val.a;
        var v = val.diff.a;

        var aLen = a.modulus();
        var vLen = v.modulus();

        var aHat = a.toUnitVector();
        var vProj = this.orthProj(v, a);
        var vComp = this.orthComp(v, a);
        var aLenDot = v.dot(aHat);
        var aHatDot = vComp.x(1 / aLen);

        var direction = this.sign(aHatDot.to3D().cross(aHat.to3D()).dot(Vector.k));

        this.save();
        this.translate($V([-2.5, 0]));
        this.arrow(O, a, "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, a, $V([0, 1]), "TEX:$\\vec{a}$");
        }
        if (this.getOption("showVelocity")) {
            this.arrow(a, a.add(v), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine(a, a.add(v), $V([1, 0]), "TEX:$\\dot{\\vec{a}}$");
            }
        }
        if (this.getOption("showVelocityDecomp")) {
            this.arrow(a, a.add(vProj), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine(a, a.add(vProj), $V([0, -this.sign(aLenDot)]), "TEX:$\\dot{a}\\hat{a}$");
            }
            this.arrow(a, a.add(vComp), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine(a, a.add(vComp), $V([0, -direction]), "TEX:$a\\dot{\\hat{a}}$");
            }
        }
        this.restore();

        this.save();
        this.translate($V([1, 0]));
        var d = 0.1;
        this.line(O, $V([0, aLen]), "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, $V([0, aLen]), $V([0, 1]), "TEX:$a$");
        }
        if (this.getOption("showVelocityDecomp")) {
            this.line($V([d, aLen]), $V([d, aLen + aLenDot]), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine($V([d, aLen]), $V([d, aLen + aLenDot]), $V([0, -this.sign(aLenDot)]), "TEX:$\\dot{a}$");
            }
        }
        this.restore();

        this.save();
        this.translate($V([4, 0]));
        this.arrow(O, aHat, "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, aHat, $V([0, 1]), "TEX:$\\hat{a}$");
        }
        if (this.getOption("showVelocityDecomp")) {
            this.arrow(aHat, aHat.add(aHatDot), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine(aHat, aHat.add(aHatDot), $V([0, direction]), "TEX:$\\dot{\\hat{a}}$");
            }
        }
        this.restore();

        this.text($V([1, -2.7]), $V([0, -1]),
                  "TEX:vector\\qquad\\qquad$=$\\qquad\\qquad length\\qquad\\quad$\\times$\\quad\\qquad direction");
    });
    rvy_fd_c = new PrairieDraw("rvy-fd-c", function() {
        this.setUnits(11, 11);

        this.addOption("r", 4);
        this.addOption("thetaDeg", 45);
        this.addOption("z", 4);

        this.addOption("showLabels", true);
        this.addOption("showCoords", true);
        this.addOption("showBasis", false);

        this.addOption("showCoordLineR", false);
        this.addOption("showCoordLineTheta", false);
        this.addOption("showCoordLineZ", false);

        var O = $V([0, 0, 0]);
        var rX = $V([5, 0, 0]);
        var rY = $V([0, 5, 0]);
        var rZ = $V([0, 0, 5]);
        this.arrow(O, rX);
        this.arrow(O, rY);
        this.arrow(O, rZ);
        if (this.getOption("showLabels")) {
            this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            this.labelLine(O, rY, $V([1, 1]), "TEX:$y$");
            this.labelLine(O, rZ, $V([1, 1]), "TEX:$z$");
        }

        var r = this.getOption("r");
        var theta = this.degToRad(this.getOption("thetaDeg"));
        var z = this.getOption("z");

        var p = this.cylindricalToRect($V([r, theta, z]));
        var pXY = this.cylindricalToRect($V([r, theta, 0]));
        var pZ = this.cylindricalToRect($V([0, 0, z]));
        var pX = this.cylindricalToRect($V([r, 0, 0]));
        var pXZ = this.cylindricalToRect($V([r, 0, z]));

        if (this.getOption("showLabels")) {
            this.labelIntersection(O, [rX, rY, rZ, p, pXY], "TEX:$O$");
            this.labelIntersection(p, [O, pXY], "TEX:$P$");
        }

        if (this.getOption("showCoordLineR")) {
            var pZExt = this.cylindricalToRect($V([6, theta, z]));
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.line(pZ, pZExt);
            this.restore();
        }

        if (this.getOption("showCoordLineTheta")) {
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.arc3D(pZ, r, Vector.k);
            this.restore();
        }

        if (this.getOption("showCoordLineZ")) {
            var pZ1 = this.cylindricalToRect($V([r, theta, -5]));
            var pZ2 = this.cylindricalToRect($V([r, theta, 5]));
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.line(pZ1, pZ2);
            this.restore();
        }

        this.arrow(O, p, "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, p, $V([0, 1]), "TEX:$\\vec{\\rho}$");
        }

        if (this.getOption("showCoords")) {
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.setProp("arrowLinePattern", "dashed");
            if (z !== 0 && theta !== 0) {
                this.arrow(O, pXY);
            }
            if (this.getOption("showLabels")) {
                this.labelLine(O, pXY, $V([0, -1]), "TEX:$r$");
            }
            if (z !== 0) {
                this.line(pZ, p);
            }
            if (z !== 0 && theta !== 0) {
                this.line(pZ, pXZ);
            }

            if (!(this.getOption("showCoordLineTheta") && z === 0)) {
                this.circleArrow3D(O, r, Vector.k, Vector.i, 0, theta);
            }
            if (!this.getOption("showCoordLineTheta")) {
                this.arc3D(pZ, r, Vector.k, Vector.i, 0, theta);
            }
            if (this.getOption("showLabels")) {
                var thetaText = undefined;
                if (theta > 0) {
                    thetaText = "TEX:$\\theta$";
                } else if (theta < 0) {
                    thetaText = "TEX:$-\\theta$";
                }
                this.labelCircleLine3D(thetaText, $V([0, 1]), O, r, Vector.k, Vector.i, 0, theta);
            }

            if (!this.getOption("showCoordLineZ")) {
                this.arrow(pXY, p);
            }
            if (theta !== 0) {
                this.line(pX, pXZ);
            };
            if (z < 0) {
                this.line(O, pZ);
            }
            if (this.getOption("showLabels")) {
                if (z > 0) {
                    this.labelLine(pXY, p, $V([0, -1]), "TEX:$z$");
                } else if (z < 0) {
                    this.labelLine(pXY, p, $V([0, 1]), "TEX:$-z$");
                }
            }
            this.restore();
        }

        if (this.getOption("showBasis")) {
            var eR = this.cylindricalToRect($V([1, theta, 0]));
            var eTheta = $V([-Math.sin(theta), Math.cos(theta), 0]);
            var eZ = $V([0, 0, 1]);
            this.arrow(p, p.add(eR));
            this.arrow(p, p.add(eTheta));
            this.arrow(p, p.add(eZ));
            if (this.getOption("showLabels")) {
                this.labelLine(p, p.add(eR), $V([1, 0]), "TEX:$\\hat{e}_r$");
                this.labelLine(p, p.add(eTheta), $V([1, 0]), "TEX:$\\hat{e}_\\theta$");
                this.labelLine(p, p.add(eZ), $V([1, 0]), "TEX:$\\hat{e}_z$");
            }
        }
    });
    
    rfb_xzf_f = new PrairieDraw("rfb-xzf-f", function() {
        this.setUnits(6, 4);

        this.addOption("stage", 0);
        this.addOption("FBD", false);

        var stage = Number(this.getOption("stage"));
        
        var label;

        switch(stage) {
            case 0:
                label = "TEX:\\sf Initial truss";
                break;
            case 1:
                label = "TEX:\\sf Inspect $G$";
                break;
            case 2:
                label = "TEX:\\sf Inspect $C$";
                break;
            case 3:
                label = "TEX:\\sf Inspect $F$";
                break;
            case 4:
                label = "TEX:\\sf Inspect $B$";
                break;
            case 5:
                label = "TEX:\\sf Inspect $G$, $F$, $C$, $B$"
                break;
            case 6:
                label = "TEX:\\sf Simplified truss";
                break;
        };

        var optB = 0;
        var optD = 1;
        var optG = 0;

        var a = 1;

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        
        var rA = $V([0, 0]);  
		var rB = $V([-a, 0]);
		var rC = $V([-2*a, 0]); 
		var rD = $V([-3*a, 0]); 
		var rE = $V([-4*a, 0]); 
		var rF = $V([-a, a]); 
		var rG = $V([-3*a, a]); 
		var rH = $V([-2*a, 2*a]);
		var rb = rB.add(this.vector2DAtAngle(-Math.PI/4).x(.5));
		var rd = rD.add(ej.x(-.5));
		var rg = rG.add(ei.x(-.5));
		var rh = rH.add(ej.x(.5));
		
		// ghost points for bounding box
		
        var bbox = PrairieGeom.boundingBox2D([rA,rh,rE,rd]);	
		var scale = 1;
        var scale = Math.min(6 / bbox.extent.e(1), 6 / this.goldenRatio / bbox.extent.e(2));
        rA = rA.x(scale);
		rB = rB.x(scale);
        rC = rC.x(scale);
		rD = rD.x(scale);
		rE = rE.x(scale);
		rF = rF.x(scale);
		rG = rG.x(scale);
		rH = rH.x(scale);
		rb = rb.x(scale);
		rd = rd.x(scale);
		rg = rg.x(scale);
		rh = rh.x(scale);
		
        var bbox = PrairieGeom.boundingBox2D([rA,rh,rE,rd]);
       
        this.save();
        this.translate(bbox.center.x(-1));

        w = 0.1;

        switch(stage) {
            case 0:
                this.rod(rH, rF, w);
                this.rod(rH, rB, w);
                this.rod(rH, rC, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rB, rF, w);
                this.rod(rD, rG, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);
                break;
            case 1:
                this.save();
                this.setProp("shapeOutlineColor", "rgba(0, 0, 0, 0.3)");
                this.setProp("shapeInsideColor", "rgba(255, 255, 255, 0.3)");
                this.rod(rH, rF, w);
                this.rod(rH, rB, w);
                this.rod(rH, rC, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rB, rF, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);
                this.restore();
                this.rod(rD, rG, w);
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.circle(rG, 0.2, false);
                this.restore();
                break;
            case 2:
                this.save();
                this.setProp("shapeOutlineColor", "rgba(0, 0, 0, 0.3)");
                this.setProp("shapeInsideColor", "rgba(255, 255, 255, 0.3)");
                this.rod(rH, rF, w);
                this.rod(rH, rB, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rB, rF, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);
                this.restore();
                this.rod(rH, rC, w);
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.circle(rC, 0.2, false);
                this.restore();
                break;
            case 3:
                this.save();
                this.setProp("shapeOutlineColor", "rgba(0, 0, 0, 0.3)");
                this.setProp("shapeInsideColor", "rgba(255, 255, 255, 0.3)");
                this.rod(rH, rF, w);
                this.rod(rH, rB, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);
                this.restore();
                this.rod(rB, rF, w);
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.circle(rF, 0.2, false);
                this.restore();
                break;
            case 4:
                this.save();
                this.setProp("shapeOutlineColor", "rgba(0, 0, 0, 0.3)");
                this.setProp("shapeInsideColor", "rgba(255, 255, 255, 0.3)");
                this.rod(rH, rF, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);
                this.restore();
                this.rod(rH, rB, w);
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.circle(rB, 0.2, false);
                this.restore();
                break;
            case 5:
                this.rod(rH, rF, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);

                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.circle(rG, 0.2, false);
                this.circle(rF, 0.2, false);
                this.circle(rC, 0.2, false);
                this.circle(rB, 0.2, false);
                this.restore();
                break;
            case 6:
                this.rod(rH, rA, w);
                this.rod(rH, rD, w);
                this.rod(rH, rE, w);

                this.rod(rA, rD, w);
                
                this.rod(rD, rE, w);
                break;
        };
        this.save();
	
		z = .2;
		w = z/4;
		var baseA = rA.add(ej.x(-.25));
		var baseE = rE.add(ej.x(-.25));
        if ((stage === 0 || stage === 6) && !this.getOption("FBD")) {
            this.pivot(baseA, rA, z);		
            this.pivot(baseE, rE, z);
            this.restore();
            
            this.ground(baseA, ej, .4);
            this.ground(baseE, ej, .4);
        };
		
		// force vectors
		this.save();
		
		////////////////////////////////////
		if ( optB == 1 ) {
			this.arrow(rb, rB, "force");
			this.text(rb, $V([-1, -1]), "TEX:$P$"); 
		};
		
		//////////////////////////////////////
		if ( optD == 1 ) {
			this.arrow(rd, rD, "force");
			this.text(rd, $V([-1, 0]), "TEX:$P$");
		};

		//////////////////////////////////////
		if ( optG == 1 ) {
			this.arrow(rg, rG, "force");
			this.text(rg, $V([1, 1]), "TEX:$P$");
		};
		
		//////////////////////////////////////
		// force at H
		this.arrow(rH, rh, "force");
		this.text(rh, $V([1, 0]), "TEX:$P$");
		this.restore();

        if (this.getOption("FBD")) {
            var thetaReaction = Math.PI/4;
            this.arrow(rE, rE.add($V([Math.cos(thetaReaction), Math.sin(thetaReaction)])), "force");
            this.arrow(rA, rA.add($V([-Math.cos(thetaReaction), Math.sin(thetaReaction)])), "force");

            this.labelLine(rE, rE.add($V([Math.cos(thetaReaction), Math.sin(thetaReaction)])), ej.x(2), "TEX:$F_E$");
            this.labelLine(rA, rA.add($V([-Math.cos(thetaReaction), Math.sin(thetaReaction)])), ej.x(-2), "TEX:$F_A$");
        };
		
        if (stage <= 5) {
            this.point(rA);
            this.point(rB);
            this.point(rC);
            this.point(rD);
            this.point(rE);
            this.point(rF);
            this.point(rG);
            this.point(rH);

            this.text(rA, $V([-2.5, 0]), "TEX:$A$");  
            this.text(rB, $V([1.5, 1.5]), "TEX:$B$");
            this.text(rC, $V([1.5, 1.5]), "TEX:$C$");
            this.text(rD, $V([1.5, 1.5]), "TEX:$D$");
            this.text(rE, $V([1, -2]), "TEX:$E$");  
            this.text(rF, $V([-1, -1.5]), "TEX:$F$");
            this.text(rG, $V([1, -1.5]), "TEX:$G$");
            this.text(rH, $V([2, 0]), "TEX:$H$");
        } else {
            this.point(rA);
            this.point(rD);
            this.point(rE);
            this.point(rH);

            this.text(rA, $V([-2.5, 0]), "TEX:$A$");  
            this.text(rD, $V([1.5, 1.5]), "TEX:$D$");
            this.text(rE, $V([1, -2]), "TEX:$E$");  
            this.text(rH, $V([2, 0]), "TEX:$H$");
        };
        
        this.text(O.add(ej.x(2.5)).add(ei.x(-4.5)), O, label);		
        
        this.restore();
    });

    $( window ).on( "resize", function() {
        rvv_fc_c.redraw();
        rfb_xzf_f.redraw();
        rvy_fd_c.redraw();
        rvc_fm_c.redraw();
    })

})